import React from "react";

interface Folder {
  title: string;
}
interface Props {
  folder: Folder;
}
const NavListItem = ({ folder }: Props) => <li>{folder.title}</li>;

export default NavListItem;
