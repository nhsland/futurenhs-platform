import React, { FC, useEffect, useState } from "react";

import styled from "styled-components";

import { MenuButton } from ".";
import { MeatballIcon } from "../Icon";
import MenuList from "./MenuList";
import { MenuItem } from "./MenuListItem";

interface Props {
  hiddenUntilHover?: boolean;
  items: MenuItem[];
  dataCy?: string;
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
    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      justify-content: space-between;
      display: flex;
    }
  `}
`;

const Menu: FC<Props> = ({ hiddenUntilHover, items, dataCy }) => {
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

  return (
    <>
      <Container ref={container}>
        <MenuButton
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          hiddenUntilHover={hiddenUntilHover || false}
          dataCy={dataCy}
        >
          <MeatballIcon />
        </MenuButton>
        {menuOpen && (
          <MenuList hiddenUntilHover={hiddenUntilHover || false}>
            {items}
          </MenuList>
        )}
      </Container>
    </>
  );
};

export default Menu;
