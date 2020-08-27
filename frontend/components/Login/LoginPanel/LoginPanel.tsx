import React from "react";
import { Panel } from "nhsuk-react-components";
import styled from "styled-components";

type LoginPanelProps = {
  label: string;
  text: string;
};

const StyledLoginPanel = styled(Panel)`
  ${({ theme }) => `
    background-color: ${theme.colorNhsukWhite};
    padding: 15px;
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
