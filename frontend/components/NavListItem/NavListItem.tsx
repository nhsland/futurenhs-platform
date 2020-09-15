import React from "react";

import Link from "next/link";
import styled from "styled-components";

interface Folder {
  title: string;
}

interface Props {
  item: Folder;
  itemType: "folder";
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

const NavListItem = ({ item, itemType, workspaceId }: Props) => {
  const icon = icons[itemType];
  return (
    <ListItem>
      <Link href={`${workspaceId}/folder/${item.title}`}>
        <a>
          <img src={icon || ""} />
          <div>{item.title}</div>
        </a>
      </Link>
    </ListItem>
  );
};

export default NavListItem;
