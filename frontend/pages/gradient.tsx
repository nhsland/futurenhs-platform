import React from "react";
import { PageLayout } from "../components/PageLayout";
import { Header } from "../components/Header";
import { Gradient } from "../components/Gradient";
import { LoginPanel } from "../components/Login/LoginPanel";
import styled from "styled-components";

export const StyledPageWrapper = styled.div`
  ${({ theme }) => `
    min-height: 100vh;
    background-color: ${theme.colorNhsukWhite};
  `}
`;

export const StyledLoginPlaceholder = styled.div`
  ${({ theme }) => `
    min-height: 421px;
    min-width: 287px;
    background-color: ${theme.colorNhsukGrey5};
    margin: 40px 0;

    @media (min-width: ${theme.mqBreakpoints.tablet}) {
      min-width: 435px;
    }

    @media (min-width: ${theme.mqBreakpoints.desktop}) {
      min-width: 477px;
    }

    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      min-width: 481px;
      min-height: 504px;
    }
  `}
`;

const GradientPage = () => {
  return (
    <StyledPageWrapper>
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
    </StyledPageWrapper>
  );
};

export default GradientPage;
