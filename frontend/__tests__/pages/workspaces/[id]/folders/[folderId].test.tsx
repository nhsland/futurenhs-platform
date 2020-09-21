import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../../../../lib/fixtures/theme.json";
import FolderHomepage from "../../../../../pages/workspaces/[id]/folders/[folderId]";

describe(FolderHomepage, () => {
  test("renders matching snapshot", () => {
    const workspace = { title: "hospital", id: "1" };
    const folders = [
      {
        id: "f1",
        title: "folder 1",
        description: "first folder",
        workspace: "1",
      },
    ];

    const container = render(
      <ThemeProvider theme={theme}>
        <FolderHomepage
          folder={folders[0]}
          workspace={workspace}
          workspaceFolders={folders}
        />
      </ThemeProvider>
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
