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
 *
 * This doesn't change any behaviour. It's purely a type cast.
 */
const updateWithNull = <T extends { __typename?: "Query" }>(
  handler: (data: (Data & T) | null) => (Data & T) | null
): ((data: Data | null) => Data | null) => handler as any;

/**
 * Creates an updater for a given Query type, which performs no update if the
 * currently cached query result is null.
 */
const update = <T extends { __typename?: "Query" }>(
  handler: (data: Data & T) => (Data & T) | null
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
          const { __typename, id, title, workspace } = result.createFolder;
          if (!workspace) return;
          cache.updateQuery(
            {
              query: FoldersByWorkspaceDocument,
              variables: { workspace },
            },
            update<FoldersByWorkspaceQuery>((data) => {
              if (!id || !title) return null;
              data.foldersByWorkspace.push({ __typename, id, title });
              return data;
            })
          );
        },
        deleteFile: (result, _args, cache) => {
          const { __typename, id } = result.deleteFile;
          if (!__typename || !id) return;
          cache.invalidate({ __typename, id });
        },
        createFile: (result, _args, cache) => {
          const {
            __typename,
            id,
            folder,
            title,
            description,
            fileName,
            fileType,
            modifiedAt,
          } = result.createFile;
          if (!folder) return;
          cache.updateQuery(
            {
              query: FilesByFolderDocument,
              variables: { folder },
            },
            update<FilesByFolderQuery>((data) => {
              if (
                !id ||
                !title ||
                !description ||
                !fileName ||
                !fileType ||
                !modifiedAt
              )
                return null;
              data.filesByFolder.push({
                __typename,
                id,
                folder,
                title,
                description,
                fileName,
                fileType,
                modifiedAt,
              });
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
