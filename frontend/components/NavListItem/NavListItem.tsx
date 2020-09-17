import React from "react";

import Link from "next/link";
import styled from "styled-components";

import { Folder } from "../../lib/generated/graphql";

type ListItem = Pick<Folder, "id" | "title">;

interface Props {
  active: boolean;
  item: ListItem;
  workspaceId: string;
}

const ListItem = styled.li<any>`
  margin-bottom: 12px;
  list-style-type: none;
  border-radius: 4px;
  &:hover {
    ${({ theme }) => `
    background-color: ${theme.colorNhsukGrey4}
  `}
  }
  a {
    display: flex;
    padding-left: 8px;
    text-decoration: none;
    &:focus {
      box-shadow: none;
    }
  }
  img {
    /*  */
    padding-top: 2px;
    align-self: baseline;
    /* stop things jumping about while svgs load */
    width: 24px;
    flex-shrink: 0;
  }
  div {
    padding-left: 4px;
    padding-right: 4px;
    ${({ theme }) => `
    color: ${theme.colorNhsukBlack};
  `}
  }
`;

const icons: { [key: string]: string } = {
  closed: require("../../public/folderClosed.svg"),
  open: require("../../public/folderOpen.svg"),
};

const NavListItem = ({ active, item, workspaceId }: Props) => (
  <ListItem style={active ? { background: "#ffeb3b", fontWeight: 700 } : {}}>
    <Link href={`/workspaces/${workspaceId}/folders/${item.id}`}>
      <a>
        <img src={active ? icons["open"] : icons["closed"]} />
        <div>{item.title}</div>
      </a>
    </Link>
  </ListItem>
);

export default NavListItem;
