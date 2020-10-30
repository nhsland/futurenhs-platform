import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../lib/fixtures/theme.json";
import Footer, { FooterListItem } from "./Footer";

describe(Footer, () => {
  it("renders correctly", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});

describe(FooterListItem, () => {
  it("renders correctly with props", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <FooterListItem title="testTitle" href="testHref" />
      </ThemeProvider>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
