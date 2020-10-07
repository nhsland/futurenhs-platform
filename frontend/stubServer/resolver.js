const createFolderResponse = require("../cypress/fixtures/create-folder-graphql-response.json");
const fileResponse = require("../cypress/fixtures/file-graphql-response.json");
const fileUploadUrlResponse = require("../cypress/fixtures/file-upload-url-graphql-response.json");
const filesByFolderResponse = require("../cypress/fixtures/files-by-folder-graphql-response.json");
const folderResponse = require("../cypress/fixtures/folder-graphql-response.json");
const foldersByWorkspaceResponse = require("../cypress/fixtures/folders-by-workspace-graphql-response.json");
const workspaceResponse = require("../cypress/fixtures/workspace-graphql-response.json");

const workspacesResolver = {
  workspaces: async () => workspaceResponse.data.workspaces,
  workspace: async () => workspaceResponse.data.workspaces[0],
};

const fileResolver = {
  filesByFolder: async () => filesByFolderResponse.data.filesByFolder,
  file: async () => fileResponse.data.file,
};

const folderResolver = {
  foldersByWorkspace: async () =>
    foldersByWorkspaceResponse.data.foldersByWorkspace,
  folder: async () => folderResponse.data.folder,
};

const fileUploadUrlResolver = {
  fileUploadUrl: async () => fileUploadUrlResponse.data.fileUploadUrl,
};

const folderMutation = {
  createFolder: async () => createFolderResponse.data.createFolder,
};

module.exports = (schema) => {
  const federationResolver = {
    _service: async () => ({
      sdl: schema,
    }),
  };

  return {
    Query: {
      ...workspacesResolver,
      ...folderResolver,
      ...fileResolver,
      ...fileUploadUrlResolver,
      ...federationResolver,
    },
    Mutation: { ...folderMutation },
  };
};
