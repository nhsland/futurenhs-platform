import React from "react";
import { Panel } from "nhsuk-react-components";
import styled from "styled-components";

type LoginPanelProps = {
  label: string;
  text: string;
};

const StyledLoginPanel = styled(Panel)`
  ${() => `
    background-color: transparent;
    padding: 0px;
    max-width: 392px;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
