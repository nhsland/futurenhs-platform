import React, { ReactNode } from "react";

import Link from "next/link";
import styled from "styled-components";

interface FolderListItemProps {
  className?: string;
  href: string;
  children: ReactNode;
}

const FolderListItem = ({ className, href, children }: FolderListItemProps) => (
  <Link href={href}>
    <li className={className}>
      <a href={href}>{children}</a>
    </li>
  </Link>
);

const StyledListItem = styled(FolderListItem)`
  list-style: none;
  margin: 0;
  box-shadow: inset 0px -1px 0px #e8edee;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    border: none;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${({ theme }) => `
    a {
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

interface FolderMenuListItemProps {
  className?: string;
  title: string;
  icon: ReactNode;
  href: string;
}

const FolderMenuListItem = ({
  className,
  title,
  icon,
  href,
}: FolderMenuListItemProps) => {
  return (
    <StyledListItem className={className} href={href}>
      {icon}
      {title && <StyledTitle>{title}</StyledTitle>}
    </StyledListItem>
  );
};

export default FolderMenuListItem;
