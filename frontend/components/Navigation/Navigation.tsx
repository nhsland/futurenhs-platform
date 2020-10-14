import React, { FC } from "react";

import Link from "next/link";
import styled from "styled-components";

import { useFoldersByWorkspaceQuery } from "../../lib/generated/graphql";
import { FolderMenu, MenuItem } from "../FolderMenu";
import { DeleteIcon, EditIcon, LockIcon, MoveIcon, UploadIcon } from "../Icon";
import { NavListItem } from "../NavListItem";
import { NavSection } from "../NavSection";

const Nav = styled.nav`
  display: none;
  padding-top: 24px;
  padding-right: 52px;
  padding-left: 20px;
  flex-shrink: 0;
  flex-grow: 0;
  box-sizing: border-box;
  width: 270px;
  ${({ theme }) => `
    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      display: block;
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

const WorkspaceTitleLink = styled.a`
  text-decoration: none;
  color: inherit;
  &:hover {
    color: inherit;
  }
  &:visited {
    color: inherit;
  }
`;

const List = styled.ul`
  padding-left: 0px;
  .nav-list-item {
    div {
      font-weight: 700;
      ${({ theme }) => `
      color: ${theme.colorNhsukBlue}`}
    }
  }
`;

interface Props {
  workspaceId: string;
  workspaceTitle: string;
  activeFolder?: string;
}

const Navigation: FC<Props> = ({
  workspaceId,
  workspaceTitle,
  activeFolder,
}) => {
  const [{ data, fetching, error }] = useFoldersByWorkspaceQuery({
    variables: { workspace: workspaceId },
  });

  if (fetching || !data) return <p>Loading...</p>;
  if (error) return <p> Oh no... {error?.message} </p>;

  const createFolder = {
    id: "create-folder",
    title: "Create new folder",
    description: "create folder",
    workspace: workspaceId,
  };

  const icons: { [key: string]: string } = {
    closed: require("../../public/folderClosed.svg"),
    open: require("../../public/folderOpen.svg"),
  };

  const alphabetisedFolders = [...data.foldersByWorkspace].sort((a, b) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base" })
  );

  return (
    <Nav>
      <Header>
        <Link href={`/workspaces/${workspaceId}`} passHref>
          <WorkspaceTitleLink>
            <h3>{workspaceTitle}</h3>
          </WorkspaceTitleLink>
        </Link>

        <Link href={`/workspaces/${workspaceId}`}>
          <a>About this workspace</a>
        </Link>
      </Header>
      <NavSection title="Folders">
        <List>
          <NavListItem
            active={createFolder.id === activeFolder}
            item={createFolder}
            imgSrc={require("../../public/createFolder.svg")}
            className="nav-list-item"
            href={`/workspaces/${workspaceId}/folders/${createFolder.id}`}
            altText=""
          />
          {alphabetisedFolders.map((folder) => {
            const items: MenuItem[] = [
              {
                title: "Upload file to this folder",
                icon: <UploadIcon />,
                href: `/workspaces/${workspaceId}/folders/${folder.id}/upload-file`,
              },
              {
                title: "Edit folder details",
                icon: <EditIcon />,
                href: "#",
              },
              {
                title: "Move folder",
                icon: <MoveIcon />,
                href: "#",
              },
              {
                title: "View folder permissions",
                icon: <LockIcon />,
                href: "#",
              },
              {
                title: "Delete folder",
                icon: <DeleteIcon />,
                href: "#",
              },
            ];
            return (
              <NavListItem
                active={folder.id === activeFolder}
                key={folder.id}
                item={folder}
                imgSrc={
                  folder.id === activeFolder ? icons["open"] : icons["closed"]
                }
                altText={
                  folder.id === activeFolder ? "folder current page" : "folder"
                }
                href={`/workspaces/${workspaceId}/folders/${folder.id}`}
                menu={
                  <FolderMenu
                    folderId={folder.id}
                    items={items}
                    hiddenUntilHover={true}
                  />
                }
              />
            );
          })}
        </List>
      </NavSection>
    </Nav>
  );
};

export default Navigation;
