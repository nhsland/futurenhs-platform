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
  &:hover {
    ${({ theme }) => `
    background-color: ${theme.colorNhsukGrey4}
  `}
  }
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

const icons: { [key: string]: string } = {
  closed: require("../../public/closedFolder.svg"),
  open: require("../../public/openFolder.svg"),
};

const NavListItem = ({ active, item, workspaceId }: Props) => (
  <ListItem style={{ background: active ? "#ffeb3b" : "" }}>
    <Link href={`/workspaces/${workspaceId}/folders/${item.id}`}>
      <a>
        <img src={active ? icons["open"] : icons["closed"]} />
        <div>{item.title}</div>
      </a>
    </Link>
  </ListItem>
);

export default NavListItem;
