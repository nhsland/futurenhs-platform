import React from "react";
import styled from "styled-components";

type GradientProps = {
  children?: React.ReactNode;
};

export const StyledGradient = styled.div`
  ${({ theme }) => `

    background-color: ${theme.colorNhsukWhite};
    height: 600px;

    .container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;


      @media (min-width: 1200px) {
        flex-direction: row;
      }
    }

    .gradient-container {
      height: 144px;
      width: 100%;
      background-image: linear-gradient(66deg, #ffb600, #fc8600 100%);
      background-color: ${theme.colorNhsukWhite};
      position: absolute;
      left: 0;

      @media (min-width: 1200px) {
        height: 112px;
        width: 100%;
      }
    }


  `}
`;

const Gradient = ({ children }: GradientProps) => {
  return (
    <StyledGradient>
      <div className="gradient-container">
        <div className="container">{children}</div>
      </div>
    </StyledGradient>
  );
};

export default Gradient;
