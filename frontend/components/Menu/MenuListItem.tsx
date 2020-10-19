import React, { ComponentPropsWithoutRef, FC, ReactNode } from "react";

import Link from "next/link";
import styled from "styled-components";

interface ListItemProps {
  className?: string;
  href: string;
  children: ReactNode;
  isButton?: boolean;
  onClick?: () => void;
}

const ListItem = ({
  className,
  href,
  children,
  isButton,
  onClick,
}: ListItemProps) => {
  return (
    <li className={className}>
      {isButton ? (
        <button onClick={onClick}>{children}</button>
      ) : (
        <Link href={href} passHref>
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
  href: string;
  isButton?: boolean;
  onClick?: () => void;
};

interface MenuListItemProps extends ComponentPropsWithoutRef<"li"> {
  title: string;
  href: string;
  isButton?: boolean;
  onClick?: () => void;
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
