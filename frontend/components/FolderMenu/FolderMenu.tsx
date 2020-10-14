import React, { FC, useEffect, useState } from "react";

import styled from "styled-components";

import { FolderMenuButton } from ".";
import { MeatballIcon } from "../Icon";
import FolderMenuList from "./FolderMenuList";
import { MenuItem } from "./FolderMenuListItem";

interface Props {
  hiddenUntilHover?: boolean;
  items: MenuItem[];
  folderId: string;
}

const Container = styled.div`
  align-items: center;
  position: relative;
  height: 100%;
  border-radius: 4px;
  margin-left: 7px;

  .tooltip {
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

const FolderMenu: FC<Props> = ({ hiddenUntilHover, items }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const container = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pageClickEvent = ({ target }: MouseEvent) => {
      if (!container.current?.contains(target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      window.addEventListener("click", pageClickEvent);
    }

    return () => window.removeEventListener("click", pageClickEvent);
  }, [menuOpen]);

  console.log(items ? items : "No items yet");

  return (
    <>
      <Container ref={container}>
        <FolderMenuButton
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          hiddenUntilHover={hiddenUntilHover || false}
        >
          <MeatballIcon />
        </FolderMenuButton>
        {menuOpen && (
          <FolderMenuList hiddenUntilHover={hiddenUntilHover || false}>
            {items}
          </FolderMenuList>
        )}
      </Container>
    </>
  );
};

export default FolderMenu;
