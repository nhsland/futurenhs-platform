import React from "react";

import styled from "styled-components";
import { v4 as uuid } from "uuid";

import { NavListItem } from "../NavListItem";

interface Workspace {
  title: string;
  id: string;
  // folders: any[]; //TODO!
}

const Nav = styled.nav`
  padding-top: 24px;
  padding-right: 40px;
  padding-left: 32px;
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

const NavHeader = styled.nav`
  padding-left: 8px;
  ${({ theme }) => `
  border-bottom: 1px solid ${theme.colorNhsukGrey1};
  `};
`;

const NavSection = styled.section`
  padding-top: 24px;
  ${({ theme }) => `
    h4 {
    color: ${theme.colorNhsukBlue};
  }`}
`;

const folders = [{ title: "Folder 1" }, { title: "Folder 2" }];

interface Props {
  workspace: Workspace;
}

const Navigation = ({ workspace }: Props) => (
  <Nav>
    <NavHeader>
      <h3>{workspace.title}</h3>
      {/* <a>About this workspace</a> */}
    </NavHeader>
    <NavSection>
      <h4>Quick Links</h4>
    </NavSection>
    <NavSection>
      <h4>Folders</h4>
      <ul>
        {folders.map((folder) => (
          <NavListItem
            key={uuid()}
            item={folder}
            workspaceId={workspace.id}
            icon="folder"
          />
        ))}
      </ul>
    </NavSection>
  </Nav>
);

export default Navigation;
