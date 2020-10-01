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

interface Props {
  startHidden?: boolean;
}

const items = [
  {
    title: "Upload file to this folder",
    icon: <UploadIcon />,
    href: "upload",
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
  display: none;
  position: relative;

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

const NavHeader: FC<Props> = ({ startHidden }) => {
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
        {menuOpen && <FolderMenuList items={items} />}
      </Container>
    </>
  );
};

export default NavHeader;
