import React, { ReactNode } from "react";

import { Icons } from "nhsuk-react-components";
import styled from "styled-components";
import { v4 as uuid } from "uuid";

import { NavMenuListItem } from ".";

const StyledCloseIcon = styled(Icons.Close)`
  ${({ theme }) => `
    :hover {
      fill: ${theme.colorNhsukWhite};
      background-color: ${theme.colorShadeNhsukBlue35};
    }
    :active {
      fill: ${theme.colorNhsukBlack};
      background-color: ${theme.colorNhsukYellow};
      border-bottom: 4px solid ${theme.colorNhsukBlack};
    }
  `}
`;

const StyledNavMenuContainer = styled.div`
  width: 100%;
  right: 0;

  ${({ theme }) => `
    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      max-width: 280px;
      position: absolute;
    }
    background-color: ${theme.colorNhsukWhite};
    border-left: 1px solid ${theme.colorNhsukGrey5};
    border-bottom: 1px solid ${theme.colorNhsukGrey5};
  `}

  // This is the "Menu  X" item that appears only on mobile
  p {
    margin: 0;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: centre;

    ${({ theme }) => `
      @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
        display: none;
      }
    `}
  }

  span {
    font-weight: 700;
    align-self: center;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  // Hiding the first li item on desktop because it appears in menu bar
  li:first-child {
    ${({ theme }) => `
      @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
        display: none;
      }
    `}
  }
`;

type NavItems = { title: string; icon: ReactNode; href: string };

interface NavListProps {
  navItems: NavItems[];
  setMenuOpen: (open: boolean) => void;
}

const NavList = ({ navItems, setMenuOpen }: NavListProps) => {
  return (
    <StyledNavMenuContainer>
      <p>
        <span>Menu</span>
        <StyledCloseIcon onClick={() => setMenuOpen(false)} />
      </p>
      <ul>
        {navItems.map((item) => {
          return (
            <NavMenuListItem
              title={item.title}
              icon={item.icon}
              href={item.href}
              key={uuid()}
            />
          );
        })}
      </ul>
    </StyledNavMenuContainer>
  );
};

export default NavList;
