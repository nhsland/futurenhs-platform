import React from "react";
import { PageLayout } from "../components/PageLayout";
import { Header } from "../components/Header";
import { Gradient } from "../components/Gradient";
import { LoginPanel } from "../components/Login/LoginPanel";
import styled from "styled-components";

export const StyledLoginPlaceholder = styled.div`
  ${() => `
    height:100%;
    min-height: 421px;
    min-width: 287px;
    background-color: grey;
    margin: 40px 0;

    @media (min-width: 641px) {
      min-width: 435px;
    }

    @media (min-width: 769px) {
      min-width: 477px;
    }

    @media (min-width: 990px) {
      min-width: 481px;
      min-height: 504px;
    }
  `}
`;

const GradientPage = () => {
  return (
    <div css="background-color: white">
      <PageLayout>
        <Header
          imageRight="NHS.png"
          imageRightURL="https://www.nhs.co.uk"
          imageRightAltText="NHS logo"
        />
        <Gradient>
          <StyledLoginPlaceholder />
          <LoginPanel
            label="Welcome to FutureNHS"
            text="FutureNHS connects people and helps build relationships across the health and social care sector"
          />
        </Gradient>
      </PageLayout>
    </div>
  );
};

export default GradientPage;
