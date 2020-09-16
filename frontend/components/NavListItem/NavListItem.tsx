import React from "react";

import Link from "next/link";
import styled from "styled-components";

interface Folder {
  title: string;
}

interface Props {
  item: Folder;
  icon: "folder";
  workspaceId: string;
}

const ListItem = styled.li`
  list-style-type: none;
  a {
    display: flex;
  }
  div {
    ${({ theme }) => `
    color: ${theme.colorNhsukBlack};
  `}
  }
`;

const icons: { [key: string]: string } = {
  folder: require("../../public/closedFolder.svg"),
};

const NavListItem = ({ item, icon, workspaceId }: Props) => (
  <ListItem>
    <Link href={`${workspaceId}/folder/${item.title}`}>
      <a>
        <img src={icons[icon] || ""} />
        <div>{item.title}</div>
      </a>
    </Link>
  </ListItem>
);

export default NavListItem;
