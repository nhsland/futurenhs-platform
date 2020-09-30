import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { Provider } from "urql";
import { fromValue, never } from "wonka";

import theme from "../../lib/fixtures/theme.json";
import Navigation from "./Navigation";

describe.only("<Navigation/>", () => {
  const responseState = {
    executeQuery: jest.fn(() =>
      fromValue({
        data: {
          foldersByWorkspace: [
            { id: "1234", title: "Folder 1" },
            { id: "5678", title: "Folder 2" },
          ],
        },
      })
    ),
    executeMutation: jest.fn(() => never),
    executeSubscription: jest.fn(() => never),
  };
  it("renders correctly", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <Provider value={responseState}>
          <Navigation workspaceId="1111" workspaceTitle="My workspace" />
        </Provider>
      </ThemeProvider>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
