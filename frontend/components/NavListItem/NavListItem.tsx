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
    align-self: baseline;
    padding-top: 2px;
    /* stop things jumping about while svgs load */
    width: 24px;
  }
  div {
    ${({ theme }) => `
    color: ${theme.colorNhsukBlack};
  `}
  }
`;

const icons: { [key: string]: string } = {
  closed: require("../../public/closedFolder.svg"),
  open: require("../../public/openFolder.svg"),
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
