import React, { FC, useState } from "react";

import styled from "styled-components";

import { FolderMenuButton } from ".";
import {
  DeleteIcon,
  EditIcon,
  LockIcon,
  MeatballIcon,
  MoveIcon,
  UploadIcon,
} from "../Icon";
import FolderMenuList from "./FolderMenuList";
import { MenuItem } from "./FolderMenuListItem";

interface Props {
  startHidden?: boolean;
}

const items: MenuItem[] = [
  {
    title: "Upload file to this folder",
    icon: <UploadIcon />,
    href: "upload-file",
    relativeUrl: true,
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

const Container = styled.div`
  align-items: center;
  position: relative;
  height: 100%;
  border-radius: 4px;
  margin-left: 7px;

  .tooltip-inner {
    left: 36px;
    top: -7px;
  }

  ${({ theme }) => `
    .folder-menu-item {
      display: none;

      a {
        color: ${theme.colorNhsukWhite};
        &:focus {
          color: ${theme.colorNhsukBlack};
        }
      }
    }

    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      justify-content: space-between;
      display: flex;

      .folder-menu-item {
        display: flex;
      }
    }
  `}
`;

const FolderMenu: FC<Props> = ({ startHidden }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Container>
        <FolderMenuButton
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          startHidden={startHidden || false}
        >
          <MeatballIcon />
        </FolderMenuButton>
        {menuOpen && (
          <FolderMenuList startHidden={startHidden || false}>
            {items}
          </FolderMenuList>
        )}
      </Container>
    </>
  );
};

export default FolderMenu;
