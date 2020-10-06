import React from "react";

import { ThemeProvider } from "styled-components";

import theme from "../../../../../../lib/fixtures/theme.json";
import {
  FoldersByWorkspaceDocument,
  GetFolderByIdDocument,
  GetWorkspaceByIdDocument,
} from "../../../../../../lib/generated/graphql";
import { render } from "../../../../../../lib/test-helpers/render";
import { mockUrqlClient } from "../../../../../../lib/test-helpers/urql";
import UploadFile from "../../../../../../pages/workspaces/[workspaceId]/folders/[folderId]/upload-file";

describe(UploadFile, () => {
  const client = mockUrqlClient([
    [
      GetWorkspaceByIdDocument,
      {
        workspace: {
          id: "w1",
          title: "hospital",
          description: "hospital",
        },
      },
    ],
    [
      GetFolderByIdDocument,
      {
        folder: {
          id: "f1",
          title: "folder 1",
          description: "first folder",
          workspace: "w1",
        },
      },
    ],
    [
      FoldersByWorkspaceDocument,
      {
        foldersByWorkspace: [
          {
            id: "f1",
            title: "folder 1",
            description: "first folder",
            workspace: "w1",
          },
        ],
      },
    ],
  ]);

  test("renders matching snapshot", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <UploadFile urqlClient={client} />
      </ThemeProvider>,
      {
        router: {
          query: { workspaceId: "w1", folderId: "f1" },
        },
      }
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
