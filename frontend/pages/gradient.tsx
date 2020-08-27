import React from "react";
import { PageLayout } from "../components/PageLayout";
import { Header } from "../components/Header";
import { Gradient } from "../components/Gradient";
import { LoginPanel } from "../components/Login/LoginPanel";

const LoginPlaceholder = () => {
  return <div className="loginPlaceholder"></div>;
};

const GradientPage = () => {
  return (
    <PageLayout>
      <Header
        imageRight="NHS.png"
        imageRightURL="https://www.nhs.co.uk"
        imageRightAltText="NHS logo"
      />
      <Gradient />
      <section className="loginSection">
        <LoginPlaceholder />
        <LoginPanel
          label="Welcome to FutureNHS"
          text="FutureNHS connects people and helps build relationships across the health and social care sector"
        />
      </section>
    </PageLayout>
  );
};

export default GradientPage;
