import React from "react";

import Link from "next/link";
import styled from "styled-components";

interface Folder {
  title: string;
}

interface Props {
  active: boolean;
  item: Folder;
  icon: "folder";
  workspaceId: string;
}

const ListItem = styled.li<any>`
  list-style-type: none;
  border: 1px solid red;
  background-color: ${(props) =>
    props.active ? props.theme.nhsukButtonActiveColor : "pink"};
  a {
    display: flex;
    padding-left: 8px;
    &:focus {
      box-shadow: none;
    }
  }
  div {
    ${({ theme }) => `
    color: ${theme.colorNhsukBlack};
  `}
  }
`;

const icons: { [key: string]: { [key: string]: string } } = {
  folder: {
    closed: require("../../public/closedFolder.svg"),
    open: require("../../public/openFolder.svg"),
  },
};

const NavListItem = ({ active, item, icon, workspaceId }: Props) => (
  <ListItem>
    <Link href={`${workspaceId}/folder/${item.title}`}>
      <a>
        <img src={active ? icons[icon]["open"] : icons[icon]["closed"]} />
        <div>{item.title}</div>
      </a>
    </Link>
  </ListItem>
);

export default NavListItem;
