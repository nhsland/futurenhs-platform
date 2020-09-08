import React from "react";
// import { GraphQLClient } from "graphql-request";
import { getSdk } from "../../lib/generated/graphql";
import { Head } from "../../components/Head";
import { Header } from "../../components/Header";
import { GraphQLClient } from "graphql-request";
import { PageLayout } from "../../components/PageLayout";
import styled from "styled-components";
import { GetServerSideProps } from "next";
import { requireAuthentication } from "../../lib/auth";

interface Workspace {
  id: string;
  title: string;
  longDescription: string;
}

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async () => {
    const client = new GraphQLClient(
      "http://workspace-service.workspace-service/graphql"
    );
    const sdk = getSdk(client);
    const { workspaces } = await sdk.GetAllWorkspaces();
    return {
      props: {
        workspaces,
      },
    };
  }
);

const PageContent = styled.div`
  ${({ theme }) => `
  background-color: ${theme.colorNhsukWhite};
  min-height: 100vh;
  padding-top: 24px;
  padding-left: 10%;
  padding-right: 10%;
  .nhsuk-form-group {
    margin-bottom: 8px;
  }
  `}
`;

const H2 = styled.h2`
  ${({ theme }) => `
  border-top: 1px solid ${theme.colorNhsukGrey1};
  padding-top: 24px;
  margin-bottom: 8px;
  color: ${theme.colorNhsukGrey1} 
  `}
`;

interface Props {
  workspaces: Workspace[];
}
const WorkspaceHomepage = ({ workspaces }: Props) => {
  return (
    <>
      <Head title="TODO: My workspace" />
      <PageLayout>
        <Header />
        <PageContent>
          <h1>Create a workspace</h1>
          <H2>Workspace details</H2>
          <ul>
            {workspaces.map((w) => (
              <li key={w.id}>{w.title}</li>
            ))}
          </ul>
        </PageContent>
      </PageLayout>
    </>
  );
};

export default WorkspaceHomepage;
