import React, { FC } from "react";

import styled from "styled-components";

import { MinusIcon, PlusIcon } from "../Icon";

const IconClickTarget = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: inherit;

  color: ${({ theme }) => theme.colorNhsukBlue};

  :hover {
    opacity: 1;
    color: ${({ theme }) => theme.colorShadeNhsukBlue35};
  }

  :active,
  :focus {
    opacity: 1;
    color: ${({ theme }) => theme.colorNhsukYellow};
    outline: none;
    svg circle {
      fill: black;
    }
  }
`;

interface Props {
  expanded: boolean;
  onClick: () => void;
}

const Expander: FC<Props> = ({ expanded, onClick }) => {
  return (
    <IconClickTarget onClick={onClick}>
      {expanded ? <MinusIcon /> : <PlusIcon />}
    </IconClickTarget>
  );
};

export default Expander;
