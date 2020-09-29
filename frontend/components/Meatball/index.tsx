import React from "react";

import Icon from "./SvgIcon";

interface Props {
  active?: boolean;
  children: React.ReactNode;
}

const Meatball = ({ active, children }: Props) => {
  return <Icon active={active || false}>{children}</Icon>;
};

export default Meatball;
