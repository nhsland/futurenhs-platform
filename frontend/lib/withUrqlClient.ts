import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { NextPage } from "next";
import { withUrqlClient as withUrqlClientImpl } from "next-urql";
import NextApp from "next/app";
import { dedupExchange, fetchExchange } from "urql";

import { User } from "./auth";
import {
  CreateFolderMutation,
  DeleteFileMutation,
  FoldersByWorkspaceDocument,
  FoldersByWorkspaceQuery,
  FilesByFolderDocument,
  FilesByFolderQuery,
} from "./generated/graphql";
import { requireEnv } from "./server/requireEnv";

const isServerSide = typeof window === "undefined";
const workspaceAPIServerUrl = isServerSide
  ? requireEnv("WORKSPACE_SERVICE_GRAPHQL_ENDPOINT")
  : "/api/graphql";

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
              createFolder: (result, _args, cache) => {
                const folderMutation = result as CreateFolderMutation;
                cache.updateQuery(
                  {
                    query: FoldersByWorkspaceDocument,
                    variables: {
                      workspace: folderMutation.createFolder.workspace,
                    },
                  },
                  (data) => {
                    const foldersByWorkspaceQuery = data as FoldersByWorkspaceQuery;
                    foldersByWorkspaceQuery.foldersByWorkspace.push(
                      folderMutation.createFolder
                    );
                    return data;
                  }
                );
              },
              deleteFile: (result, _args, cache) => {
                const mutationResult = result as DeleteFileMutation;
                cache.updateQuery(
                  {
                    query: FilesByFolderDocument,
                    variables: {
                      folder: mutationResult.deleteFile.folder,
                    },
                  },
                  (data) => {
                    const filesByFolderQuery = data as FilesByFolderQuery;
                    const arr = filesByFolderQuery.filesByFolder.filter(
                      (file) => file.id !== mutationResult.deleteFile.id
                    );

                    filesByFolderQuery.filesByFolder = arr;

                    return data;
                  }
                );
              },
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
