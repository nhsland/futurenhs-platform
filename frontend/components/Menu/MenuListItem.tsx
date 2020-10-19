import React, { ComponentPropsWithoutRef, FC, ReactNode } from "react";

import Link from "next/link";
import styled from "styled-components";

type Href = string;
type OnClickFn = () => void;

interface ListItemProps {
  className?: string;
  children: ReactNode;
  handler: Href | OnClickFn;
}

const ListItem = ({ className, children, handler }: ListItemProps) => {
  return (
    <li className={className}>
      {typeof handler === "function" ? (
        <button onClick={handler}>{children}</button>
      ) : (
        <Link href={handler} passHref>
          <a>{children}</a>
        </Link>
      )}
    </li>
  );
};

const StyledListItem = styled(ListItem)`
  box-shadow: inset 0px -1px 0px #e8edee;
  list-style: none;
  margin: 0;

  a,
  button {
    align-items: center;
    border: none;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    width: 100%;
  }

  button {
    background: ${({ theme }) => theme.colorNhsukWhite};
    font-size: 19px;
    line-height: 28px;
    text-align: left;
  }

  .icon-wrapper {
    align-items: center;
    display: flex;
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
  handler: Href | OnClickFn;
};

interface MenuListItemProps extends ComponentPropsWithoutRef<"li"> {
  title: string;
  handler: Href | OnClickFn;
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
