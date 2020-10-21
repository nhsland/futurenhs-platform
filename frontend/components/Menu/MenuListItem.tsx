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
    border-radius: 4px;
    border: none;
    outline: 4px solid transparent;
  }

  .icon-wrapper {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  ${({ theme }) => `
   button {
     &:hover {
        color: ${theme.colorNhsukWhite};
        &.hidden {
          color: ${theme.colorNhsukWhite};
        }
        background-color: ${theme.colorShadeNhsukBlue35};
      }
      &:active, :focus {
        color: ${theme.colorNhsukBlack};
        &.hidden {
          color: ${theme.colorNhsukBlack};
        }
        border:none;
        background-color: ${theme.colorNhsukYellow};
        box-shadow: 0 -2px transparent, 0 4px #212b32;
      }
   }

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
  dataCy?: string;
};

interface MenuListItemProps extends ComponentPropsWithoutRef<"li"> {
  title: string;
  handler: Href | OnClickFn;
  dataCy?: string;
}

const MenuListItem: FC<MenuListItemProps> = ({
  title,
  children,
  dataCy,
  ...props
}) => {
  return (
    <StyledListItem {...props}>
      {children}
      {title && <StyledTitle data-cy={dataCy}>{title}</StyledTitle>}
    </StyledListItem>
  );
};

export default MenuListItem;
