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
import FolderHomepage from "../../../../../../pages/workspaces/[workspaceId]/folders/[folderId]";

describe(FolderHomepage, () => {
  const client = mockUrqlClient([
    [
      GetWorkspaceByIdDocument,
      {
        workspace: {
          id: "1",
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
          workspace: "1",
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
            workspace: "1",
          },
        ],
      },
    ],
  ]);

  test("renders matching snapshot", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <FolderHomepage urqlClient={client} />
      </ThemeProvider>,
      {
        router: {
          query: { workspaceId: "1", folderId: "f1" },
        },
      }
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
