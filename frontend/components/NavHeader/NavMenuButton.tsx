import React from "react";

import styled from "styled-components";

interface MenuProps {
  className?: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const MenuButton = ({ className, menuOpen, setMenuOpen }: MenuProps) => {
  return (
    <button className={className} onClick={() => setMenuOpen(!menuOpen)}>
      Menu
    </button>
  );
};

const StyledNavMenuButton = styled(MenuButton)`
  ${({ theme }) => `
    color: ${theme.colorNhsukWhite};
    padding: 7px 16px;
    height: 100%;
    background-color: transparent;
    border: 1px solid ${theme.colorNhsukWhite};
    border-radius: 4px;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;

    :focus {
      outline: none;
    }

    :hover {
      background-color: ${theme.colorShadeNhsukBlue35};
      border-color: ${theme.colorNhsukGrey5};
      box-shadow: none;
    }

    :active, :focus {
      border: 1px solid ${theme.colorNhsukYellow};
      color: ${theme.colorNhsukBlack};
      background-color: ${theme.colorNhsukYellow};
      border-color: ${theme.colorNhsukYellow};
    }
  `}
`;

export { StyledNavMenuButton as NavMenuButton };
