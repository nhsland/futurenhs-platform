import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { NextPage } from "next";
import { withUrqlClient as withUrqlClientImpl } from "next-urql";
import NextApp from "next/app";
import { dedupExchange, fetchExchange } from "urql";

import { User } from "./auth";
import {
  CreateFileMutation,
  CreateFileVersionMutation,
  CreateFolderMutation,
  DeleteFileMutation,
  GetFileByIdDocument,
  GetFileByIdQuery,
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
                    const foldersByWorkspaceQuery = data as FoldersByWorkspaceQuery | null;
                    if (foldersByWorkspaceQuery === null) {
                      return null;
                    }
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
                    const filesByFolderQuery = data as FilesByFolderQuery | null;
                    if (filesByFolderQuery === null) {
                      return null;
                    }
                    const arr = filesByFolderQuery.filesByFolder.filter(
                      (file) => file.id !== mutationResult.deleteFile.id
                    );

                    filesByFolderQuery.filesByFolder = arr;

                    return data;
                  }
                );
              },
              createFile: (result, _args, cache) => {
                const fileMutation = result as CreateFileMutation;
                cache.updateQuery(
                  {
                    query: FilesByFolderDocument,
                    variables: {
                      folder: fileMutation.createFile.folder,
                    },
                  },
                  (data) => {
                    const filesByFolderQuery = data as FilesByFolderQuery | null;
                    if (filesByFolderQuery === null) {
                      return null;
                    }
                    filesByFolderQuery.filesByFolder.push(
                      fileMutation.createFile
                    );
                    return data;
                  }
                );
              },
              createFileVersion: (result, _args, cache) => {
                const fileMutation = result as CreateFileVersionMutation;
                cache.updateQuery(
                  {
                    query: FilesByFolderDocument,
                    variables: {
                      folder: fileMutation.createFileVersion.folder,
                    },
                  },
                  (data) => {
                    const filesByFolderQuery = data as FilesByFolderQuery | null;
                    if (filesByFolderQuery === null) {
                      return null;
                    }

                    const arr = filesByFolderQuery.filesByFolder.filter(
                      (file) => file.id !== fileMutation.createFileVersion.id
                    );

                    filesByFolderQuery.filesByFolder = arr;

                    filesByFolderQuery.filesByFolder.push(
                      fileMutation.createFileVersion
                    );
                    return data;
                  }
                );
                cache.updateQuery(
                  {
                    query: GetFileByIdDocument,
                    variables: {
                      id: fileMutation.createFileVersion.id,
                    },
                  },
                  (data) => {
                    const getFileByIdQuery = data as GetFileByIdQuery | null;

                    if (getFileByIdQuery === null) {
                      return null;
                    }

                    getFileByIdQuery.file = fileMutation.createFileVersion;
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
