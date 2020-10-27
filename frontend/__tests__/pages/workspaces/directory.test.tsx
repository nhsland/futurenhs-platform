import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../../lib/fixtures/theme.json";
import { GetWorkspacesDocument } from "../../../lib/generated/graphql";
import { mockUrqlClient } from "../../../lib/test-helpers/urql";
import WorkspaceDirectory from "../../../pages/workspaces/directory";

test("takes a snapshot of the component", () => {
  const client = mockUrqlClient([
    [
      GetWorkspacesDocument,
      {
        workspaces: [
          { title: "hospital", id: "1", description: "hospital" },
          { title: "pharmacy", id: "2", description: "pharmacy" },
          { title: "ambulance", id: "3", description: "ambulance" },
        ],
      },
    ],
  ]);

  const { asFragment } = render(
    <ThemeProvider theme={theme}>
      <WorkspaceDirectory urqlClient={client} />
    </ThemeProvider>
  );
  expect(asFragment()).toBeTruthy();
});
