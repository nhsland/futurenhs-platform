import React, { FC, ReactNode } from "react";

import styled from "styled-components";

import { FolderMenuListItem } from ".";

const Container = styled.div`
  width: 320px;
  top: 40px;
  right: 0px;

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
  }
`;

type MenuItems = { title: string; icon: ReactNode; href: string };

interface Props {
  items: MenuItems[];
}

const FolderMenuList: FC<Props> = ({ items }) => {
  return (
    <Container>
      <ul>
        {items.map((item) => (
          <FolderMenuListItem
            title={item.title}
            icon={item.icon}
            href={item.href}
            key={item.title}
          />
        ))}
      </ul>
    </Container>
  );
};

export default FolderMenuList;
