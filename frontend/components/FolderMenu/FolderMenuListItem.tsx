import React, { ComponentPropsWithoutRef, FC, ReactNode } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

interface FolderListItemProps {
  className?: string;
  href: string;
  children: ReactNode;
  relativeUrl?: boolean;
}

const FolderListItem = ({
  className,
  href,
  relativeUrl,
  children,
}: FolderListItemProps) => {
  let url = href;
  const router = useRouter();
  if (relativeUrl) {
    let base = router.asPath;
    base = base.replace(`/${url}`, ""); // if we're already on this route, remove it first
    url = `${base}/${url}`;
  }

  return (
    <li className={className}>
      <Link href={url} passHref>
        <a>{children}</a>
      </Link>
    </li>
  );
};

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

export type MenuItem = {
  title: string;
  icon: ReactNode;
  href: string;
  relativeUrl?: boolean;
};

interface FolderMenuListItemProps extends ComponentPropsWithoutRef<"li"> {
  title: string;
  href: string;
  relativeUrl?: boolean;
}

const FolderMenuListItem: FC<FolderMenuListItemProps> = ({
  title,
  children,
  ...props
}) => {
  return (
    <StyledListItem {...props}>
      {children}
      {title && <StyledTitle>{title}</StyledTitle>}
    </StyledListItem>
  );
};

export default FolderMenuListItem;
