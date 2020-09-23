import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../lib/fixtures/theme.json";
import NavSection from "./NavSection";

describe("<NavSection/>", () => {
  it("shows children when open (default)", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <NavSection title="Folders">Look at me! I am children!</NavSection>
      </ThemeProvider>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it("does not render children when closed", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <NavSection title="Folders" initiallyOpen={false}>
          I should not exist because nav is not open.
        </NavSection>
      </ThemeProvider>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
