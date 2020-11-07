import React from "react";

import { render } from "@testing-library/react";

import Permissions from "./Permissions";

describe(Permissions, () => {
  it("renders matching snapshot", () => {
    const container = render(<Permissions />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
