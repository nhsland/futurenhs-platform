import React, { ReactNode } from "react";

import styled from "styled-components";

import { NavListItem } from "..";

const StyledNavTitle = styled.div`
  padding-left: 20px;
  flex-grow: 1;
`;

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

interface NavListItemProps {
  title: string;
  icon: ReactNode;
  href: string;
}

const NavMenuListItem = ({ title, icon, href }: NavListItemProps) => {
  return (
    <StyledNavListItem href={href}>
      {icon}
      <StyledNavTitle>{title}</StyledNavTitle>
    </StyledNavListItem>
  );
};

export default NavMenuListItem;
