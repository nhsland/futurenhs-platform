import React, { FC, ComponentPropsWithoutRef } from "react";

import styled from "styled-components";

interface MenuProps extends ComponentPropsWithoutRef<"button"> {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const MenuButton: FC<MenuProps> = ({
  className,
  menuOpen,
  setMenuOpen,
  ...rest
}) => (
  <button
    className={className}
    onClick={() => setMenuOpen(!menuOpen)}
    {...rest}
  />
);

const FolderMenuButton = styled(MenuButton)<{ isVisible: boolean }>`
  ${({ isVisible, theme }) => `
    background-color: ${isVisible ? theme.colorNhsukGrey4 : "transparent"};
    opacity: ${isVisible ? 1 : 0};
    color: ${theme.colorNhsukWhite};
    padding: 0;
    height: 100%;
    border-radius: 4px;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    border:none;

    :hover {
      opacity: 1;
      background-color: ${theme.colorShadeNhsukBlue35};
    }

    :active, :focus {
      opacity: 1;
      color: ${theme.colorNhsukBlack};
      background-color: ${theme.colorNhsukYellow};
    }
  `}
`;

export default FolderMenuButton;
