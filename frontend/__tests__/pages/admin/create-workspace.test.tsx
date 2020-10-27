import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../../lib/fixtures/theme.json";
import { mockUrqlClient } from "../../../lib/test-helpers/urql";
import CreateWorkspace, {
  CreateWorkspace as CreateWorkspaceComponent,
} from "../../../pages/admin/create-workspace";

test("Render the page with error text when no platform admin privs", () => {
  const client = mockUrqlClient([]);

  const { getByText } = render(
    <ThemeProvider theme={theme}>
      <CreateWorkspace urqlClient={client} isPlatformAdmin={false} />
    </ThemeProvider>
  );
  expect(getByText("You do not have permission to do this.")).toBeTruthy()
});

test("Render the page with form", () => {
  const client = mockUrqlClient([]);

  const { getByText } = render(
    <ThemeProvider theme={theme}>
      <CreateWorkspace urqlClient={client} isPlatformAdmin={true} />
    </ThemeProvider>
  );
  expect(getByText("Create a workspace")).toBeTruthy()
});

test("getInitialProps returns the correct field", async () => {
  const context = {
    req: {
      user: {
        isPlatformAdmin: true,
      },
    },
  };
  const result = await CreateWorkspaceComponent.getInitialProps!(
    context as any
  );

  expect(result).toEqual({ isPlatformAdmin: true });
});
