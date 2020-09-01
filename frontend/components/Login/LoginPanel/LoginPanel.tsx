import React from "react";
import { Panel } from "nhsuk-react-components";
import styled from "styled-components";

type LoginPanelProps = {
  label: string;
  text: string;
};

const StyledLoginPanel = styled(Panel)`
  ${({ theme }) => `
    background-color: transparent;
    padding: 0px;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    // .h2 {
    //   font-size: ${theme.nhsukTypographyScale.tablet};
    //   line-height: 36px;
    // }

    // .p {
    //   font-size: 24px;
    //   color: #425462;
    // }

    @media (min-width: 1200px) {
      padding-left: 108px;
    }
    `}
`;

const LoginPanel = ({ label, text }: LoginPanelProps) => {
  return (
    <StyledLoginPanel>
      <h2>{label}</h2>
      <p>{text}</p>
    </StyledLoginPanel>
  );
};

export default LoginPanel;
