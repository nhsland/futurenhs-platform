import React from "react";

import styled from "styled-components";

interface Workspace {
  title: string;
  // folders: any[]; //TODO!
}
interface Props {
  workspace: Workspace;
}

const Nav = styled.nav`
  border: 1px solid red;
`;

const folders = [{ title: "Folder 1" }, { title: "Folder 2" }];
const WorkspaceNavigation = ({ workspace }: Props) => (
  <Nav>
    <div>
      <h3>{workspace.title}</h3>
      <a>About this workspace</a>
    </div>
    <div>
      <section>
        <h4>Quick Links</h4>
      </section>
      <section>
        <h4>Folders</h4>
        <ul>
          {folders.map((folder) => (
            <li key={folder.title}>{folder.title}</li>
          ))}
        </ul>
      </section>
    </div>
  </Nav>
);

export default WorkspaceNavigation;
