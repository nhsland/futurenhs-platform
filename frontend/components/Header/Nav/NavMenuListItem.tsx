import React, { ReactNode } from "react";

import Link from "next/link";
import { ChevronRightIcon } from "nhsuk-react-components";
import styled from "styled-components";

interface NavItemProps {
  className?: string;
  href: string;
  children: ReactNode;
}

const NavListItem = ({ className, href, children }: NavItemProps) => {
  return (
    <Link href={href}>
      <li className={className}>
        <a href={href}>
          {children}
          <ChevronRightIcon />
        </a>
      </li>
    </Link>
  );
};

const StyledNavListItem = styled(NavListItem)`
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    border-bottom: 4px solid transparent;
    border-top: 4px solid transparent;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${({ theme }) => `
    border-top: 1px solid ${theme.colorNhsukGrey5};

    a {
      color: ${theme.colorNhsukBlue};
      text-decoration: none;

      &:hover:not(:active) {
        color: ${theme.colorNhsukWhite};
        background-color: ${theme.colorShadeNhsukBlue35};

        .nhsuk-icon__chevron-right {
          fill: ${theme.colorNhsukWhite};
        }
      }

      &:focus {
        box-shadow: none;
        outline: none;
        border-bottom: 4px solid ${theme.colorNhsukBlack};
      }
    }
  `}
`;

const StyledNavTitle = styled.div`
  padding-left: 20px;
  flex-grow: 1;
`;

interface NavListItemProps {
  className?: string;
  title: string;
  icon: ReactNode;
  href: string;
}

const NavMenuListItem = ({
  className,
  title,
  icon,
  href,
}: NavListItemProps) => {
  return (
    <StyledNavListItem className={className} href={href}>
      {icon}
      <StyledNavTitle>{title}</StyledNavTitle>
    </StyledNavListItem>
  );
};

export default NavMenuListItem;
