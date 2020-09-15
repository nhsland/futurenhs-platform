import React from "react";

import styled from "styled-components";

interface Folder {
  title: string;
}

interface Props {
  item: Folder;
  itemType: "folder";
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

const NavListItem = ({ item, itemType }: Props) => {
  const icon = icons[itemType];
  return (
    <ListItem>
      <a>
        <img src={icon || ""} />
        <div>{item.title}</div>
      </a>
    </ListItem>
  );
};

export default NavListItem;
