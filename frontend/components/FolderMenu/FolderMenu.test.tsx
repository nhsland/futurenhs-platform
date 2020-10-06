import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../lib/fixtures/theme.json";
import FolderMenu from "./FolderMenu";

describe("<FolderMenu/>", () => {
  test("takes a snapshot, as used in the nav", () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <FolderMenu hiddenUntilHover={true} workspaceId="w1" folderId="f1" />
      </ThemeProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("takes a snapshot, as used in a page", () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <FolderMenu workspaceId="w1" folderId="f1" />
      </ThemeProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
