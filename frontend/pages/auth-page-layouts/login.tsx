import React from "react";
import { PageLayout } from "../../components/PageLayout";
import { Header } from "../../components/Header";

const Login = () => (
  <PageLayout>
    <Header
      imageRight="NHS.png"
      imageRightURL="https://www.nhs.co.uk"
      imageRightAltText="NHS logo"
    />
    <div id="api"></div>
  </PageLayout>
);

export default Login;
