import React from "react";

import { MobileList } from ".";
import { File } from "../../lib/generated/graphql";
import { render } from "../../lib/test-helpers/render";

const fakeFile: File = {
  id: "fake-file",
  createdAt: "2020-10-08T07:10:09Z",
  description: "test",
  fileName: "filename.txt",
  fileType: "application/pdf",
  folder: "fake-folder",
  latestVersion: "v2",
  modifiedAt: "2020-10-08T07:10:09Z",
  title: "My Fake File",
};

describe(MobileList, () => {
  it("renders title with a surrounding <a> when given a function component with a link", () => {
    const { getByText } = render(
      <MobileList
        // eslint-disable-next-line react/display-name
        columns={[{ content: (f: File) => <a href={f.fileName}>{f.title}</a> }]}
        data={[fakeFile]}
      />
    );
    expect(getByText("My Fake File").closest("a")).not.toBeNull();
  });

  it("renders title without a surrounding <a> when given a function component without a link", () => {
    const { getByText } = render(
      <MobileList
        // eslint-disable-next-line react/display-name
        columns={[{ content: (f: File) => <span>{f.title}</span> }]}
        data={[fakeFile]}
      />
    );
    expect(getByText("My Fake File").closest("a")).toBeNull();
  });

  it("displays the table heading if given", () => {
    const { getByText } = render(
      <MobileList data={[fakeFile]} columns={[]} tableHeading="I am a table" />
    );

    getByText("I am a table");
  });
});
