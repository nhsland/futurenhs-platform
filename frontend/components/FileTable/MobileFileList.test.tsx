import React from "react";

import { MobileFileList } from ".";
import { render } from "../../lib/test-helpers/render";

const fakeFile = {
  id: "fake-file",
  title: "My Fake File",
  folder: "fake-folder",
  fileType: "application/pdf",
  modifiedAt: "2020-10-08T07:10:09Z",
};

describe(MobileFileList, () => {
  it("renders title with a surrounding <a> if titleLink=true", () => {
    const { getByText } = render(
      <MobileFileList
        files={[fakeFile]}
        workspaceId="face-workspace"
        titleLink
      />
    );
    expect(getByText("My Fake File").closest("a")).not.toBeNull();
  });

  it("renders title without a surrounding <a> if titleLink=false", () => {
    const { getByText } = render(
      <MobileFileList
        files={[fakeFile]}
        workspaceId="face-workspace"
        titleLink={false}
      />
    );
    expect(getByText("My Fake File").closest("a")).toBeNull();
  });

  it("displays the table heading if given", () => {
    const { getByText } = render(
      <MobileFileList
        files={[fakeFile]}
        workspaceId="face-workspace"
        titleLink={false}
        tableHeading="I am a table"
      />
    );

    expect(getByText("I am a table"));
  });
});
