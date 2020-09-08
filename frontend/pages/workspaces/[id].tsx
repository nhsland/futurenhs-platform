import React from "react";
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
  async (context) => {
    const client = new GraphQLClient(
      "http://workspace-service.workspace-service/graphql"
    );
    const sdk = getSdk(client);
    const workspaceID = (context.params?.id as string) || "";
    console.log(workspaceID);

    const { workspace } = await sdk.GetWorkspaceByID({ id: workspaceID });

    return {
      props: {
        workspace,
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
  workspace: Workspace;
}
const WorkspaceHomepage = ({ workspace }: Props) => (
  <>
    <Head title={workspace.title} />
    <PageLayout>
      <Header />
      <PageContent>
        <h1>{workspace.title}</h1>
        <H2>Workspace details</H2>
      </PageContent>
    </PageLayout>
  </>
);

export default WorkspaceHomepage;
