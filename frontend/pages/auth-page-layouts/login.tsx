import React from "react";

import { GetServerSideProps } from "next";
import styled from "styled-components";

import { Footer } from "../../components/Footer";
import { Gradient, Login, LoginPanel } from "../../components/Login";
import { LoginHeader } from "../../components/LoginHeader";
import { PageLayout } from "../../components/PageLayout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    "Access-Control-Allow-Origin",
    "https://futurenhsplatform.b2clogin.com"
  );
  context.res.setHeader("Access-Control-Allow-Methods", "GET");
  return { props: {} };
};

export const StyledPageWrapper = styled.div`
  ${({ theme }) => `
    min-height: 100vh;
    background-color: ${theme.colorNhsukWhite};
  `}
`;

const LoginPage = () => {
  return (
    <div>
      <StyledPageWrapper>
        <PageLayout>
          <LoginHeader />
          <Gradient>
            <Login />
            <LoginPanel
              label="Welcome to FutureNHS"
              text="FutureNHS connects people and helps build relationships across the health and social care sector."
            />
          </Gradient>
        </PageLayout>
      </StyledPageWrapper>
      <Footer />
    </div>
  );
};

export default LoginPage;
