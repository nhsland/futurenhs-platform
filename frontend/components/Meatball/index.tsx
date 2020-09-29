import React from "react";

import Icon, { State } from "./SvgIcon";

interface Props {
  state: State;
  children: React.ReactNode;
}

const Meatball = ({ state, children }: Props) => {
  return <Icon state={state}>{children}</Icon>;
};

export { State } from "./SvgIcon";
export default Meatball;
