import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { Provider } from "urql";

import theme from "../../lib/fixtures/theme.json";
import { FoldersByWorkspaceDocument } from "../../lib/generated/graphql";
import { mockUrqlClient } from "../../lib/test-helpers/urql";
import Navigation from "./Navigation";

describe.only("<Navigation/>", () => {
  const client = mockUrqlClient([
    [
      FoldersByWorkspaceDocument,
      {
        foldersByWorkspace: [
          {
            id: "1234",
            title: "Folder 1",
            description: "Folder 1",
            workspace: "1111",
          },
          {
            id: "5678",
            title: "Folder 2",
            description: "Folder 2",
            workspace: "1111",
          },
        ],
      },
    ],
  ]);

  it("renders correctly", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <Provider value={client}>
          <Navigation workspaceId="1111" workspaceTitle="My workspace" />
        </Provider>
      </ThemeProvider>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
