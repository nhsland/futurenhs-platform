import { devtoolsExchange } from "@urql/devtools";
import {
  cacheExchange,
  Cache,
  Data,
  UpdatesConfig,
  Variables,
} from "@urql/exchange-graphcache";
import { NextPage } from "next";
import { withUrqlClient as withUrqlClientImpl } from "next-urql";
import NextApp from "next/app";
import { dedupExchange, fetchExchange } from "urql";

import { User } from "./auth";
import {
  Folder,
  File,
  FilesByFolderDocument,
  FilesByFolderQuery,
  FoldersByWorkspaceDocument,
  FoldersByWorkspaceQuery,
  Mutation,
} from "./generated/graphql";
import { requireEnv } from "./server/requireEnv";

const isServerSide = typeof window === "undefined";
const workspaceAPIServerUrl = isServerSide
  ? requireEnv("WORKSPACE_SERVICE_GRAPHQL_ENDPOINT")
  : "/api/graphql";

/**
 * Creates an updater for a given Query type.
 */
const updateWithNull = <T extends { __typename?: "Query" }>(
  handler: (data: T | null) => T | null
) => (data: Data | null) => handler(data as T | null) as Data | null;

/**
 * Creates an updater for a given Query type, which performs no update if the
 * currently cached query result is null.
 */
const update = <T extends { __typename?: "Query" }>(
  handler: (data: T) => T | null
) => updateWithNull<T>((data) => (data === null ? null : handler(data)));

type PartialChildren<T> = {
  [P in keyof T]: Partial<T[P]>;
};

type MutationUpdatesConfig = {
  [K in keyof Exclude<Mutation, "__typename">]?: (
    result: Data & PartialChildren<Pick<Mutation, K>>,
    args: Variables,
    cache: Cache
  ) => void;
};

export default function withUrqlClient(
  component: NextPage<any> | typeof NextApp
) {
  return withUrqlClientImpl(
    (ssrExchange, ctx) => {
      if (ctx && ctx.req && ctx.res) {
        // @ts-ignore
        const user: User = ctx.req.user;
        if (!user) {
          ctx.res.writeHead(302, {
            Location: `/auth/login?next=${ctx.req.url}`,
          });
          ctx.res.end();
        }
      }

      const mutationUpdateResolvers: MutationUpdatesConfig = {
        createFolder: (result, _args, cache) => {
          cache.updateQuery(
            {
              query: FoldersByWorkspaceDocument,
              variables: {
                workspace: result.createFolder.workspace!,
              },
            },
            update<FoldersByWorkspaceQuery>((data) => {
              data.foldersByWorkspace.push(result.createFolder as Folder);
              return data;
            })
          );
        },
        deleteFile: (result, _args, cache) => {
          cache.invalidate(result.deleteFile as Data);
        },
        createFile: (result, _args, cache) => {
          cache.updateQuery(
            {
              query: FilesByFolderDocument,
              variables: {
                folder: result.createFile.folder!,
              },
            },
            update<FilesByFolderQuery>((data) => {
              data.filesByFolder.push(result.createFile as File);
              return data;
            })
          );
        },
      };

      const exchanges = [
        dedupExchange,
        cacheExchange({
          keys: {},
          updates: {
            Mutation: mutationUpdateResolvers as UpdatesConfig["Mutation"],
          },
        }),
        ssrExchange,
        fetchExchange,
      ];

      if (process.env.NODE_ENV !== "production") {
        exchanges.unshift(devtoolsExchange);
      }

      return {
        exchanges,
        url: workspaceAPIServerUrl,
      };
    },
    { ssr: true }
  )(component);
}
