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
}) => {
  return (
    <Tooltip tooltip="Options">
      <button
        className={classNames(
          { open: menuOpen },
          { hidden: startHidden },
          className
        )}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Options"
        {...rest}
      />
    </Tooltip>
  );
};

const FolderMenuButton = styled(MenuButton)`
  ${({ theme }) => `
    opacity: 1;
    color: ${theme.colorNhsukGrey1};
    background-color: ${theme.colorNhsukGrey4};
    &.hidden {
      opacity: 0;
    }
    :hover {
      opacity: 1;
      color: ${theme.colorNhsukWhite};
      &.hidden {
        color: ${theme.colorNhsukWhite};
      }
      background-color: ${theme.colorShadeNhsukBlue35};
    }
    &.open, :active, :focus {
      opacity: 1;
      color: ${theme.colorNhsukBlack};
      &.hidden {
        color: ${theme.colorNhsukBlack};
      }
      background-color: ${theme.colorNhsukYellow};
    }
    
    border-radius: 4px;
    border:none;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    height: 100%;
    line-height: 24px;
    padding: 0;
    position: relative;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `}
`;

export default FolderMenuButton;
