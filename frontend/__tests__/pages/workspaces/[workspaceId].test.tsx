import React from "react";

import { ThemeProvider } from "styled-components";

import theme from "../../../lib/fixtures/theme.json";
import {
  FoldersByWorkspaceDocument,
  GetWorkspaceByIdDocument,
} from "../../../lib/generated/graphql";
import { render } from "../../../lib/test-helpers/render";
import { mockUrqlClient } from "../../../lib/test-helpers/urql";
import WorkspaceHomepage from "../../../pages/workspaces/[workspaceId]";

describe(WorkspaceHomepage, () => {
  const client = mockUrqlClient([
    [
      GetWorkspaceByIdDocument,
      {
        workspace: {
          id: "1",
          title: "hospital",
          description: "test",
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

  test("renders with folders matching snapshot", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <WorkspaceHomepage urqlClient={client} />
      </ThemeProvider>,
      {
        router: {
          query: { workspaceId: "1" },
        },
      }
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
