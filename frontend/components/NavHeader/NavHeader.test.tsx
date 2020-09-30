import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../lib/fixtures/theme.json";
import NavHeader from "./NavHeader";

describe("<NavHeader/>", () => {
  it("does not show menu in default state", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <NavHeader />
      </ThemeProvider>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it("shows menu when open", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <NavHeader initiallyOpen={true} />
      </ThemeProvider>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
