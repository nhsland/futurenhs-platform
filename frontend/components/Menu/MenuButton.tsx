import React, { FC, ComponentPropsWithoutRef } from "react";

import classNames from "classnames";
import styled from "styled-components";

import { Tooltip } from "../Tooltip";

type Background = "light" | "dark";
interface MenuProps extends ComponentPropsWithoutRef<"button"> {
  hiddenUntilHover: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  dataCy?: string;
  background: Background;
}

const MenuButton: FC<MenuProps> = ({
  className,
  hiddenUntilHover,
  menuOpen,
  setMenuOpen,
  dataCy,
  background,
  ...rest
}) => {
  return (
    <Tooltip tooltip="Options">
      <button
        className={classNames(
          { open: menuOpen },
          { hidden: hiddenUntilHover },
          { light: background === "light" },
          className
        )}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Options"
        data-cy={dataCy}
        {...rest}
      />
    </Tooltip>
  );
};

const StyledMenuButton = styled(MenuButton)`
  opacity: 1;
  color: ${({ theme }) => theme.colorNhsukGrey1};
  background-color: ${({ theme }) => theme.colorNhsukGrey4};
  &.light {
    background-color: ${({ theme }) => theme.colorNhsukGrey5};
  }
  &.hidden {
    opacity: 0;
  }
  :hover {
    opacity: 1;
    color: ${({ theme }) => theme.colorNhsukWhite};
    &.hidden {
      color: ${({ theme }) => theme.colorNhsukWhite};
    }
    background-color: ${({ theme }) => theme.colorShadeNhsukBlue35};
  }
  &.open,
  :active,
  :focus {
    opacity: 1;
    color: ${({ theme }) => theme.colorNhsukBlack};
    &.hidden {
      color: ${({ theme }) => theme.colorNhsukBlack};
    }
    background-color: ${({ theme }) => theme.colorNhsukYellow};
    outline: none;
    border-bottom: 2px solid black;
  }

  border-radius: 4px;
  border: none;
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
`;

export default StyledMenuButton;
