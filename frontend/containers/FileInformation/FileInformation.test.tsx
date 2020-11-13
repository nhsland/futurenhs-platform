import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../lib/fixtures/theme.json";
import FileInformation from "./FileInformation";

describe(FileInformation, () => {
  it("renders matching snapshot when not active", () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <FileInformation workspaceId="7cb46d97-beb4-4f48-a527-b7a1b0f9f219" />
      </ThemeProvider>
    );
    expect(container.asFragment()).toMatchSnapshot();
  });
});
