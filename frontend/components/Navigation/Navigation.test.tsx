import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../lib/fixtures/theme.json";
import Navigation from "./Navigation";

describe("<Navigation/>", () => {
  const folders = [
    { id: "1234", title: "Folder 1" },
    { id: "5678", title: "Folder 2" },
  ];
  const workspace = { id: "1111", title: "My workspace" };
  it("renders correctly", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <Navigation workspace={workspace} folders={folders} />
      </ThemeProvider>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
