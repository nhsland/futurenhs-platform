import { devtoolsExchange } from "@urql/devtools";
import {
  cacheExchange,
  Cache,
  Data,
  Variables,
} from "@urql/exchange-graphcache";
import { NextPage } from "next";
import { withUrqlClient as withUrqlClientImpl } from "next-urql";
import NextApp from "next/app";
import { dedupExchange, fetchExchange } from "urql";

import { User } from "./auth";
import {
  CreateFileMutation,
  CreateFolderMutation,
  DeleteFileMutation,
  FilesByFolderDocument,
  FilesByFolderQuery,
  FoldersByWorkspaceDocument,
  FoldersByWorkspaceQuery,
} from "./generated/graphql";
import { requireEnv } from "./server/requireEnv";

const isServerSide = typeof window === "undefined";
const workspaceAPIServerUrl = isServerSide
  ? requireEnv("WORKSPACE_SERVICE_GRAPHQL_ENDPOINT")
  : "/api/graphql";

/**
 * Creates an UpdateResolver for a given Mutation type.
 */
const resolve = <T extends { __typename?: "Mutation" }>(
  handler: (result: T, cache: Cache) => void
) => (result: Data, _args: Variables, cache: Cache) =>
  handler((result as unknown) as T, cache);

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

      const exchanges = [
        dedupExchange,
        cacheExchange({
          keys: {},
          updates: {
            Mutation: {
              createFolder: resolve<CreateFolderMutation>((result, cache) => {
                cache.updateQuery(
                  {
                    query: FoldersByWorkspaceDocument,
                    variables: {
                      workspace: result.createFolder.workspace,
                    },
                  },
                  update<FoldersByWorkspaceQuery>((data) => {
                    data.foldersByWorkspace.push(result.createFolder);
                    return data;
                  })
                );
              }),
              deleteFile: resolve<DeleteFileMutation>((result, cache) => {
                cache.invalidate(result.deleteFile as Data);
              }),
              createFile: resolve<CreateFileMutation>((result, cache) => {
                cache.updateQuery(
                  {
                    query: FilesByFolderDocument,
                    variables: {
                      folder: result.createFile.folder,
                    },
                  },
                  update<FilesByFolderQuery>((data) => {
                    data.filesByFolder.push(result.createFile);
                    return data;
                  })
                );
              }),
            },
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
