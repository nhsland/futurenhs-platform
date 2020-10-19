import React, { ComponentPropsWithoutRef, FC, ReactNode } from "react";

import Link from "next/link";
import styled from "styled-components";

interface LinkHandler {
  type: "link";
  href: string;
}

interface ButtonHandler {
  type: "button";
  onClick: () => void;
}

interface ListItemProps {
  className?: string;
  children: ReactNode;
  handler: LinkHandler | ButtonHandler;
}

const ListItem = ({ className, children, handler }: ListItemProps) => {
  return (
    <li className={className}>
      {handler.type === "button" ? (
        <button onClick={handler.onClick}>{children}</button>
      ) : (
        <Link href={handler.href} passHref>
          <a>{children}</a>
        </Link>
      )}
    </li>
  );
};

const StyledListItem = styled(ListItem)`
  list-style: none;
  margin: 0;
  box-shadow: inset 0px -1px 0px #e8edee;

  a,
  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    border: none;
  }

  button {
    background: ${({ theme }) => theme.colorNhsukWhite};
    font-size: 19px;
    line-height: 28px;
    text-align: left;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${({ theme }) => `
    a, button {
      color: ${theme.colorNhsukBlue};
      text-decoration: none;

      &:hover:not(:active) {
        color: ${theme.colorNhsukWhite};
        background-color: ${theme.colorShadeNhsukBlue35};
      }
    }
  `}
`;

const StyledTitle = styled.div`
  padding-left: 20px;
  flex-grow: 1;
`;

export type MenuItem = {
  title: string;
  icon: ReactNode;
  handler: LinkHandler | ButtonHandler;
};

interface MenuListItemProps extends ComponentPropsWithoutRef<"li"> {
  title: string;
  handler: LinkHandler | ButtonHandler;
}

const MenuListItem: FC<MenuListItemProps> = ({ title, children, ...props }) => {
  return (
    <StyledListItem {...props}>
      {children}
      {title && <StyledTitle>{title}</StyledTitle>}
    </StyledListItem>
  );
};

export default MenuListItem;
