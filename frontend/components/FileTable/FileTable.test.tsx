import React from "react";

import { FileTable, MobileFileList } from ".";
import { render } from "../../lib/test-helpers/render";

const fakeFile = {
  id: "fake-file",
  title: "My Fake File",
  folder: "fake-folder",
  fileType: "application/pdf",
  modifiedAt: "2020-10-08T07:10:09Z",
};

describe(FileTable, () => {
  it("renders title in <a> if titleLink=true", () => {
    const { getByText } = render(
      <FileTable files={[fakeFile]} workspaceId="face-workspace" titleLink />
    );
    expect(getByText("My Fake File").closest("a")).not.toBeNull();
  });

  it("renders title if titleLink=false", () => {
    const { getByText } = render(
      <FileTable
        files={[fakeFile]}
        workspaceId="face-workspace"
        titleLink={false}
      />
    );
    expect(getByText("My Fake File").closest("a")).toBeNull();
  });
});

describe(MobileFileList, () => {
  it("renders title in <a> if titleLink=true", () => {
    const { getByText } = render(
      <MobileFileList
        files={[fakeFile]}
        workspaceId="face-workspace"
        titleLink
      />
    );
    expect(getByText("My Fake File").closest("a")).not.toBeNull();
  });

  it("renders title if titleLink=false", () => {
    const { getByText } = render(
      <MobileFileList
        files={[fakeFile]}
        workspaceId="face-workspace"
        titleLink={false}
      />
    );
    expect(getByText("My Fake File").closest("a")).toBeNull();
  });
});
