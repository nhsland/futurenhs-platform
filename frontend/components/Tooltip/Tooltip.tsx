import React, { ComponentProps } from "react";

import styled from "styled-components";

interface TooltipProps extends ComponentProps<"div"> {
  tooltip: string;
}

const Outer = styled.div`
  display: inline-block;
  position: relative;
`;

const Inner = styled.span`
  ${Outer}:hover & {
    opacity: 1;
    transition: opacity 0s linear 0.5s;
  }
  opacity: 0;
  position: absolute;
  z-index: 5;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colorNhsukGrey1};
  padding: 5px;
  font-weight: 400;
  font-size: 18px;
  color: ${({ theme }) => theme.colorNhsukWhite};

  &::after {
    position: absolute;
    bottom: 33%;
    left: -10%;
    margin-left: -2px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent ${({ theme }) => theme.colorNhsukGrey1}
      transparent transparent;
    content: " ";
  }
`;

const Tooltip: React.FC<TooltipProps> = ({ tooltip, children }) => {
  return (
    <Outer>
      {children}
      <Inner className="tooltip">{tooltip}</Inner>
    </Outer>
  );
};
export default Tooltip;
