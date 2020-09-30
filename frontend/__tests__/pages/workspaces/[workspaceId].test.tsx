import React from "react";

import { ThemeProvider } from "styled-components";
import { fromValue, never } from "wonka";

import theme from "../../../lib/fixtures/theme.json";
import { render } from "../../../lib/test-helpers/render";
import WorkspaceHomepage from "../../../pages/workspaces/[workspaceId]";

describe(WorkspaceHomepage, () => {
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

  test("renders with folders matching snapshot", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <WorkspaceHomepage urqlClient={responseState} />
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
