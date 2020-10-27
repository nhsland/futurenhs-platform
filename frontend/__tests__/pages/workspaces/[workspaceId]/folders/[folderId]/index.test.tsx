import React from "react";

import { Client } from "urql";

import {
  FoldersByWorkspaceDocument,
  GetFolderByIdDocument,
  GetWorkspaceByIdDocument,
  FilesByFolderDocument,
} from "../../../../../../lib/generated/graphql";
import { render } from "../../../../../../lib/test-helpers/render";
import { mockUrqlClient } from "../../../../../../lib/test-helpers/urql";
import FolderHomepage from "../../../../../../pages/workspaces/[workspaceId]/folders/[folderId]";

describe(FolderHomepage, () => {
  const client = mockUrqlClient([
    [
      GetWorkspaceByIdDocument,
      {
        workspace: {
          id: "1",
          title: "hospital",
          description: "hospital",
        },
      },
    ],
    [
      GetFolderByIdDocument,
      {
        folder: {
          id: "f1",
          title: "folder 1",
          description: "first folder",
          workspace: "1",
        },
      },
    ],
    [
      FoldersByWorkspaceDocument,
      {
        foldersByWorkspace: [
          {
            id: "f1",
            title: "folder 1",
            description: "first folder",
            workspace: "1",
          },
        ],
      },
    ],
    [
      FilesByFolderDocument,
      {
        filesByFolder: [
          {
            id: "c12c2d6f-2669-4f82-8351-620ded995abb",
            title: "London Region NHS England Safeguarding Annual Review",
            description:
              "London Region NHS England Safeguarding Annual Review.ppt",
            folder: "f7f24c43-d3f0-4720-8995-b087316f6b44",
            fileType: "ppt",
            fileName:
              "London Region NHS England Safeguarding Annual Review.ppt",
            createdAt: "2020-10-06T17:53:45.089829+00:00",
            modifiedAt: "2020-10-06T17:53:45.089829+00:00",
            blobStoragePath: "/files/c12c2d6f-2669-4f82-8351-620ded995abb",
          },
        ],
      },
    ],
  ]);

  const renderWithClient = (client: Client) => {
    const container = render(<FolderHomepage urqlClient={client} />, {
      router: {
        query: { workspaceId: "1", folderId: "f1" },
      },
    });
    expect(container.asFragment()).toBeTruthy();
  };

  test("renders loading state without exploding", () => {
    const emptyClient = mockUrqlClient([]);
    renderWithClient(emptyClient);
  });

  test("renders without exploding", () => {
    renderWithClient(client);
  });
});
