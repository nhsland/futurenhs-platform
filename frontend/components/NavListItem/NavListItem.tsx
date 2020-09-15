import React from "react";

import styled from "styled-components";

interface Folder {
  title: string;
}

interface Props {
  item: Folder;
  itemType: "folder";
}

const Container = styled.li`
  display: flex;
`;

const NavListItem = ({ item, itemType }: Props) => {
  const icon =
    itemType === "folder" && require("../../public/closedFolder.svg");
  return (
    <Container>
      <img src={icon || ""} />
      <p>{item.title}</p>
    </Container>
  );
};

export default NavListItem;
