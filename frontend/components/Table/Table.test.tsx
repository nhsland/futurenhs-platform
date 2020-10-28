import React from "react";

import { Table } from ".";
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

describe(Table, () => {
  it("renders title with a surrounding <a> when given a correct function component", () => {
    const { getByText } = render(
      <Table
        // eslint-disable-next-line react/display-name
        columns={[{ content: (f: File) => <a href={f.fileName}>{f.title}</a> }]}
        data={[fakeFile]}
      />
    );
    expect(getByText("My Fake File").closest("a")).not.toBeNull();
  });

  it("renders title without a surrounding <a> when the supplied function component has no link", () => {
    const { getByText } = render(
      <Table
        // eslint-disable-next-line react/display-name
        columns={[{ content: (f: File) => <span>{f.title}</span> }]}
        data={[fakeFile]}
      />
    );
    expect(getByText("My Fake File").closest("a")).toBeNull();
  });

  it("displays the table heading if given", () => {
    const { getByText } = render(
      <Table data={[fakeFile]} columns={[]} tableHeading="I am a table" />
    );
    expect(getByText("I am a table"));
  });
});
