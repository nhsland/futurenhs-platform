import React from "react";

import styled from "styled-components";
import { v4 as uuid } from "uuid";

import { Folder, Workspace } from "../../lib/generated/graphql";
import { NavListItem } from "../NavListItem";

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

const Header = styled.header`
  padding-bottom: 20px;
  ${({ theme }) => `
  border-bottom: 1px solid ${theme.colorNhsukGrey1};
  `};
`;

const Section = styled.section`
  padding-top: 20px;
  ${({ theme }) => `
    h4 {
    color: ${theme.colorNhsukBlue};
  }`}
`;

const List = styled.ul`
  padding-left: 0px;
`;

interface Props {
  workspace: Pick<Workspace, "id" | "title">;
  folders: Array<Pick<Folder, "title" | "id">>;
  activeFolder?: string;
}

const Navigation = ({ workspace, folders, activeFolder }: Props) => (
  <Nav>
    <Header>
      <h3>{workspace.title}</h3>
      <a>About this workspace</a>
    </Header>
    <Section>
      <h4>Quick Links</h4>
    </Section>
    <Section>
      <h4>Folders</h4>
      <List>
        {folders.map((folder) => (
          <NavListItem
            active={folder.id == activeFolder}
            key={uuid()}
            item={folder}
            workspaceId={workspace.id}
          />
        ))}
      </List>
    </Section>
  </Nav>
);

export default Navigation;
