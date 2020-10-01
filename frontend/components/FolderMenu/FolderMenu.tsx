import React, { FC, useState } from "react";

import styled from "styled-components";

import { FolderMenuButton, FolderMenuListItem } from ".";
import { MeatballIcon } from "../Icon";

interface Props {
  startHidden?: boolean;
}

const StyledMenuContainer = styled.div`
  align-items: center;
  padding: 0;
  display: none;

  ${({ theme }) => `
    .folder-menu-item {
      display: none;
      border-top: none;

      a {
        color: ${theme.colorNhsukWhite};
        &:focus {
          color: ${theme.colorNhsukBlack};
        }
      }
    }

    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      border-top: none;
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
    <StyledMenuContainer>
      <FolderMenuButton
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        startHidden={startHidden || false}
      >
        <FolderMenuListItem
          className="folder-menu-item"
          icon={<MeatballIcon />}
        />
      </FolderMenuButton>
    </StyledMenuContainer>
  );
};

export default NavHeader;
