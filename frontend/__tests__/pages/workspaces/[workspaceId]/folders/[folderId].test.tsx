import React from "react";

import { ThemeProvider } from "styled-components";
import { fromValue, never } from "wonka";

import theme from "../../../../../lib/fixtures/theme.json";
import { render } from "../../../../../lib/test-helpers/render";
import FolderHomepage from "../../../../../pages/workspaces/[workspaceId]/folders/[folderId]";

describe(FolderHomepage, () => {
  const responseState = {
    executeQuery: jest.fn(({ query }) => {
      if (
        query.definitions.find((d: any) => d.name.value == "GetWorkspaceByID")
      ) {
        return fromValue({
          data: {
            workspace: {
              id: "1",
              title: "hospital",
            },
          },
        });
      }
      if (query.definitions.find((d: any) => d.name.value == "GetFolderById")) {
        return fromValue({
          data: {
            folder: {
              id: "f1",
              title: "folder 1",
              description: "first folder",
              workspace: "1",
            },
          },
        });
      }
      if (
        query.definitions.find((d: any) => d.name.value == "FoldersByWorkspace")
      ) {
        return fromValue({
          data: {
            foldersByWorkspace: [
              {
                id: "f1",
                title: "folder 1",
                description: "first folder",
                workspace: "1",
              },
            ],
          },
        });
      }
    }),
    executeMutation: jest.fn(() => never),
    executeSubscription: jest.fn(() => never),
  };

  test("renders matching snapshot", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <FolderHomepage urqlClient={responseState} />
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
