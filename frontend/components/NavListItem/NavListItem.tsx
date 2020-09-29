import React, { useState } from "react";

import Link from "next/link";
import styled from "styled-components";

import { Folder } from "../../lib/generated/graphql";
import { Meatball, State } from "../Meatball";

type ListItem = Pick<Folder, "id" | "title">;

interface Props {
  active: boolean;
  item: ListItem;
  workspaceId: string;
}

const ListItem = styled.li`
  list-style-type: none;
  margin-bottom: 12px;
  display: flex;
  // justify-content: space-between;
`;

const LinkWrapper = styled.div<{ active: boolean }>`
  background: ${({ active, theme }) =>
    active ? theme.colorNhsukYellow : "inherit"};
  border-radius: 4px;
  width: 227px;
  margin-right: 4px;
  font-weight: ${({ active }) => (active ? 700 : "inherit")};
  &:hover {
    ${({ theme }) => `
    background-color: ${theme.colorNhsukGrey4}
  `}
  }
  a {
    display: flex;
    padding-left: 8px;
    text-decoration: none;
    align-self: flex-start;
    &:focus {
      box-shadow: none;
    }
  }
  img {
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

const NavListItem = ({ active, item, workspaceId }: Props) => {
  const [localState, setLocalState] = useState(State.hidden);

  const onClick = () => {
    setLocalState(State.selected);
  };

  return (
    <ListItem
      onMouseEnter={() => {
        setLocalState(State.hover);
      }}
      onMouseLeave={() => {
        setLocalState(State.hidden);
      }}
    >
      <LinkWrapper active={active}>
        <Link href={`/workspaces/${workspaceId}/folders/${item.id}`}>
          <a>
            <img src={active ? icons["open"] : icons["closed"]} />
            <div>{item.title}</div>
          </a>
        </Link>
      </LinkWrapper>
      <Meatball
        onMouseEnter={() => {
          setLocalState(State.focused);
        }}
        onMouseLeave={() => {
          setLocalState(localState);
        }}
        state={localState}
        onClick={onClick}
      >
        xx
      </Meatball>
    </ListItem>
  );
};

export default NavListItem;
