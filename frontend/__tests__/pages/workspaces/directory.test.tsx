import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { fromValue, never } from "wonka";

import theme from "../../../lib/fixtures/theme.json";
import WorkspaceDirectory from "../../../pages/workspaces/directory";

test("takes a snapshot of the component", () => {
  const responseState = {
    executeQuery: jest.fn(() =>
      fromValue({
        data: {
          workspaces: [
            { title: "hospital", id: "1" },
            { title: "pharmacy", id: "2" },
            { title: "ambulance", id: "3" },
          ],
        },
      })
    ),
    executeMutation: jest.fn(() => never),
    executeSubscription: jest.fn(() => never),
  };

  const { asFragment } = render(
    <ThemeProvider theme={theme}>
      <WorkspaceDirectory urqlClient={responseState} />
    </ThemeProvider>
  );
  expect(asFragment()).toMatchSnapshot();
});
