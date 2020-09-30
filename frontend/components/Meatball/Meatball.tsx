import React from "react";

import styled from "styled-components";

import { Tooltip } from "../Tooltip";
import Icon, { State } from "./SvgIcon";

interface Props extends React.InputHTMLAttributes<HTMLButtonElement> {
  state: State;
}

const Button = styled.button`
  border: 0;
  padding: 0;
  width: 24px;
  height: 24px;
`;

const Meatball: React.FC<Props> = ({
  state,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Props) => {
  return (
    <Button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <Tooltip tooltip="Options">
        <Icon state={state}>{children}</Icon>
      </Tooltip>
    </Button>
  );
};

export { State } from "./SvgIcon";
export default Meatball;
