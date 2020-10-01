import React, {
  FC,
  ComponentPropsWithoutRef,
  ReactNodeArray,
  ReactNode,
} from "react";

import classNames from "classnames";
import styled from "styled-components";

import { FolderMenuListItem } from ".";

const Container = styled.div`
  width: 320px;
  border-radius: 4px;

  top: 32px;
  right: 0px;

  &.hidden {
    top: 0px;
    left: 32px;
  }

  ${({ theme }) => `
    position: absolute;
    background-color: ${theme.colorNhsukWhite};
    filter: drop-shadow(0px 0px 10px ${theme.nhsukBoxShadow});
  `}

  span {
    font-weight: 700;
    align-self: center;
  }

  ul {
    padding: 0;
    margin: 0;
    width: 320px;

    li:first-child a {
      border-radius: 4px 4px 0 0;
    }

    li:last-child a {
      border-radius: 0 0 4px 4px;
    }
  }
`;

export type MenuItem = { title: string; icon: ReactNode; href: string };

interface Props extends ComponentPropsWithoutRef<"div"> {
  startHidden: boolean;
}

const FolderMenuList: FC<Props> = ({ children, startHidden, className }) => {
  const items = children as ReactNodeArray;
  return (
    <Container className={classNames({ hidden: startHidden }, className)}>
      <ul>
        {items.map((item) => {
          const i = item as MenuItem;
          return (
            <FolderMenuListItem
              title={i.title}
              icon={i.icon}
              href={i.href}
              key={i.title}
            />
          );
        })}
      </ul>
    </Container>
  );
};

export default FolderMenuList;
