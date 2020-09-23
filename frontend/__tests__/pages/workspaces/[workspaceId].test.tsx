import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../../lib/fixtures/theme.json";
import WorkspaceHomepage from "../../../pages/workspaces/[workspaceId]";

describe(WorkspaceHomepage, () => {
  test("renders with folders matching snapshot", () => {
    const workspace = { title: "hospital", id: "1" };
    const folders = [{ id: "f1", title: "folder 1" }];

    const container = render(
      <ThemeProvider theme={theme}>
        <WorkspaceHomepage workspace={workspace} folders={folders} />
      </ThemeProvider>
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
