import React from "react";

import { Tooltip } from "../Tooltip";
import Icon, { State } from "./SvgIcon";

interface Props extends React.InputHTMLAttributes<HTMLButtonElement> {
  state: State;
}

const Meatball: React.FC<Props> = ({
  state,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Props) => {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <Tooltip tooltip="Options">
        <Icon state={state}>{children}</Icon>
      </Tooltip>
    </button>
  );
};

export { State } from "./SvgIcon";
export default Meatball;
