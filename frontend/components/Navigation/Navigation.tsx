import React from "react";

import styled from "styled-components";
import { v4 as uuid } from "uuid";

import { Folder } from "../../lib/generated/graphql";
import { NavListItem } from "../NavListItem";

interface Workspace {
  title: string;
  id: string;
}

const Nav = styled.nav`
  padding-top: 24px;
  padding-right: 40px;
  padding-left: 20px;
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
  padding-bottom: 20px;
  ${({ theme }) => `
  border-bottom: 1px solid ${theme.colorNhsukGrey1};
  `};
`;

const NavSection = styled.section`
  padding-top: 20px;
  ${({ theme }) => `
    h4 {
    color: ${theme.colorNhsukBlue};
  }`}
`;

const NavList = styled.ul`
  padding-left: 0px;
`;

interface Props {
  workspace: Workspace;
  folders: Array<Pick<Folder, "title" | "id">>;
  activeFolder?: string;
}

const Navigation = ({ workspace, folders, activeFolder }: Props) => (
  // console.log("The active folder is", activeFolder),
  console.log("the folders are....", folders[0]["id"]),
  (
    <Nav>
      <NavHeader>
        <h3>{workspace.title}</h3>
        <a>About this workspace</a>
      </NavHeader>
      <NavSection>
        <h4>Quick Links</h4>
      </NavSection>
      <NavSection>
        <h4>Folders</h4>
        <NavList>
          {folders.map((folder) => (
            <NavListItem
              active={folder.id == activeFolder}
              key={uuid()}
              item={folder}
              workspaceId={workspace.id}
              icon="folder"
            />
          ))}
        </NavList>
      </NavSection>
    </Nav>
  )
);

export default Navigation;
