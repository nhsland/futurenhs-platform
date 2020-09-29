import React from "react";

import styled from "styled-components";

interface TooltipProps {
  tooltip: string;
  children: React.ReactNode;
}

const Outer = styled.div`
  display: inline-block;
  position: relative;
`;

const Inner = styled.span<{ active: boolean }>`
  visibility: ${({ active }) => (active ? "visible" : "inherit")};
  position: absolute;
  middle: 50%;
  left: 100%;
  margin-left: 13px;
  z-index: 1000;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colorNhsukGrey1};
  padding: 5px;
  text-align: center;
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

const Tooltip: React.FC<TooltipProps> = ({
  tooltip,
  children,
}: TooltipProps) => {
  const [active, setActive] = React.useState(false);
  const inputRef = React.createRef<HTMLSpanElement>();

  return (
    <Outer
      onMouseEnter={() => {
        setActive(true);
      }}
      onMouseLeave={() => {
        setActive(false);
      }}
    >
      {children}
      {active && (
        <Inner active={active} ref={inputRef}>
          {tooltip}
        </Inner>
      )}
    </Outer>
  );
};
export default Tooltip;
