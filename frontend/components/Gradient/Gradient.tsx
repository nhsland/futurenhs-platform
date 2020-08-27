import React, { ReactChild } from "react";
import styled from "styled-components";

type GradientProps = {
  children?: ReactChild;
};

export const StyledGradient = styled.div`
  ${() => `
    height: 144px;
    width: 100%;
    background-image: linear-gradient(66deg, #ffb600, #fc8600 100%);

    @media (min-width: 1200px) {
      height: 112px;
      width: 100%;
    }
  `}
`;

const Gradient = ({ children }: GradientProps) => {
  return <StyledGradient>{children}</StyledGradient>;
};

export default Gradient;
