import React, { useState } from "react";

import { Tooltip } from "../Tooltip";
import Icon, { State } from "./SvgIcon";

interface Props {
  state: State;
  children: React.ReactNode;
}

const Meatball = ({ state, children }: Props) => {
  const [localState, setLocalState] = useState(state);

  const handleClick = () => {
    setLocalState(State.focused);
  };

  return (
    <button onClick={handleClick}>
      <Tooltip tooltip="Options">
        <Icon state={localState}>{children}</Icon>
      </Tooltip>
    </button>
  );
};

export { State } from "./SvgIcon";
export default Meatball;
