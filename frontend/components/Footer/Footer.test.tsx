import React from "react";

import { render } from "@testing-library/react";

import Footer, { FooterListItem } from "./Footer";

describe(Footer, () => {
  it("renders correctly", () => {
    const container = render(<Footer />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});

describe(FooterListItem, () => {
  it("renders correctly with props", () => {
    const container = render(
      <FooterListItem title="testTitle" href="testHref" />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
