import React from "react";

import { NextPage } from "next";
import styled from "styled-components";

import { Header } from "../../components/Header";
import { MainHeading } from "../../components/MainHeading";
import { PageLayout } from "../../components/PageLayout";
import WorkspaceDirectoryItem from "../../components/Workspaces/WorkspaceDirectoryItem";
import { useGetWorkspacesQuery } from "../../lib/generated/graphql";
import withUrqlClient from "../../lib/withUrqlClient";

const PageContent = styled.section`
  min-height: 100vh;
  padding-top: 24px;
  padding-left: 10%;
  padding-right: 10%;
  ${({ theme }) => `
  background-color: ${theme.colorNhsukWhite};
  `}
`;

const WorkspaceDirectory: NextPage = () => {
  const [{ data, fetching, error }] = useGetWorkspacesQuery();

  return (
    <PageLayout>
      <Header />
      <PageContent>
        <MainHeading withBorder>My workspaces</MainHeading>
        {fetching && <p>Loading...</p>}
        {error && <p> Oh no... {error?.message} </p>}
        {data?.workspaces.map((workspace) => {
          return (
            <WorkspaceDirectoryItem
              title={workspace.title}
              id={workspace.id}
              key={workspace.id}
            />
          );
        })}
      </PageContent>
    </PageLayout>
  );
};

export default withUrqlClient(WorkspaceDirectory);
