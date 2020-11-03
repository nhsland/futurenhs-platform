import React from "react";

import { render } from "@testing-library/react";

import PermissionsRadio from "./PermissionsRadio";

describe(PermissionsRadio, () => {
  it("renders matching snapshot", () => {
    const container = render(<PermissionsRadio />);

    expect(container.asFragment()).toMatchSnapshot();
  });
});
