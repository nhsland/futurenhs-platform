import React from "react";

import styled from "styled-components";
import { v4 as uuid } from "uuid";

import { NavListItem } from "../NavListItem";

interface Workspace {
  title: string;
  // folders: any[]; //TODO!
}
interface Props {
  workspace: Workspace;
}

const Nav = styled.nav`
  border: 1px solid red;
  width: 270px;
  ${({ theme }) => `
  @media (min-width: ${theme.mqBreakpoints.tablet}) {
      width: 300px;
    }

  @media (max-width: ${theme.mqBreakpoints.largeDesktop}) {
      width: 360px;
    }
  `}
`;

const folders = [{ title: "Folder 1" }, { title: "Folder 2" }];
const Navigation = ({ workspace }: Props) => (
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
            // <li key={folder.title}>{folder.title}</li>
            <NavListItem key={uuid()} folder={folder} />
          ))}
        </ul>
      </section>
    </div>
  </Nav>
);

export default Navigation;
