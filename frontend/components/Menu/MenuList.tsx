import React, { FC, ComponentPropsWithoutRef } from "react";

import classNames from "classnames";
import styled from "styled-components";

import { MenuListItem } from ".";
import { MenuItem } from "./MenuListItem";

const Container = styled.div`
  z-index: 1000;
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

    li:first-child a,
    li:first-child button {
      border-radius: 4px 4px 0 0;
    }

    li:last-child a,
    li:last-child button {
      border-radius: 0 0 4px 4px;
    }
  }
`;

interface Props extends ComponentPropsWithoutRef<"div"> {
  children?: MenuItem[];
  hiddenUntilHover: boolean;
}

const MenuList: FC<Props> = ({ children, hiddenUntilHover, className }) => {
  return (
    <Container className={classNames({ hidden: hiddenUntilHover }, className)}>
      <ul>
        {children?.map((item) => {
          const { icon, ...props } = item;
          return (
            <MenuListItem key={props.title} {...props} dataCy={props.dataCy}>
              {icon}
            </MenuListItem>
          );
        })}
      </ul>
    </Container>
  );
};

export default MenuList;
