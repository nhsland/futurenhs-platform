import React, { FC, ComponentPropsWithoutRef } from "react";

import classNames from "classnames";
import styled from "styled-components";

import { Tooltip } from "../Tooltip";

interface MenuProps extends ComponentPropsWithoutRef<"button"> {
  startHidden: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const MenuButton: FC<MenuProps> = ({
  className,
  startHidden,
  menuOpen,
  setMenuOpen,
  ...rest
}) => (
  <Tooltip tooltip="Options">
    <button
      className={classNames(
        { open: menuOpen },
        { hidden: startHidden },
        className
      )}
      onClick={() => setMenuOpen(!menuOpen)}
      {...rest}
    />
  </Tooltip>
);

const FolderMenuButton = styled(MenuButton)`
  ${({ theme }) => `
    opacity: 1;
    color: ${theme.colorNhsukBlack};
    background-color: ${theme.colorNhsukGrey4};
    &.hidden {
      opacity: 0;
      color: transparent;
      background-color: transparent;
    }
    :hover {
      opacity: 1;
      color: ${theme.colorNhsukWhite};
      background-color: ${theme.colorShadeNhsukBlue35};
    }
    &.open, :active, :focus {
      opacity: 1;
      color: ${theme.colorNhsukBlack};
      background-color: ${theme.colorNhsukYellow};
    }
    
    padding: 0;
    height: 100%;
    border-radius: 4px;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    border:none;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `}
`;

export default FolderMenuButton;
