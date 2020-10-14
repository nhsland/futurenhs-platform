import React from "react";

import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import theme from "../../lib/fixtures/theme.json";
import { UploadIcon } from "../Icon";
import Menu from "./Menu";

describe("<FolderMenu/>", () => {
  const workspaceId = "workspace-id";
  const folderId = "folder-id";

  test("takes a snapshot, as used in the nav", () => {
    const workspaceId = "workspace-id";
    const folderId = "folder-id";
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <Menu
          hiddenUntilHover={true}
          folderId="f1"
          items={[
            {
              title: "Upload file to this folder",
              icon: <UploadIcon />,
              href: `/workspaces/${workspaceId}/folders/${folderId}/upload-file`,
            },
          ]}
        />
      </ThemeProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("takes a snapshot, as used in a page", () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <Menu
          folderId="f1"
          items={[
            {
              title: "Upload file to this folder",
              icon: <UploadIcon />,
              href: `/workspaces/${workspaceId}/folders/${folderId}/upload-file`,
            },
          ]}
        />
      </ThemeProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
