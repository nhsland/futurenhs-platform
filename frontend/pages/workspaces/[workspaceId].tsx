import React from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Head } from "../../components/Head";
import { Header } from "../../components/Header";
import { MainHeading } from "../../components/MainHeading";
import { Navigation } from "../../components/Navigation";
import { PageLayout } from "../../components/PageLayout";
import { useGetWorkspaceByIdQuery } from "../../lib/generated/graphql";
import withUrqlClient from "../../lib/withUrqlClient";

const PageContent = styled.section`
  flex-grow: 3;
  min-height: 100vh;
  padding-top: 24px;
  padding-left: 10%;
  padding-right: 10%;
  ${({ theme }) => `
  background-color: ${theme.colorNhsukWhite};
  `}
`;

const H2 = styled.h2`
  padding-top: 24px;
  margin-bottom: 8px;
  ${({ theme }) => `
  border-top: 1px solid ${theme.colorNhsukGrey1};
  color: ${theme.colorNhsukGrey1}
  `}
`;

const ContentWrapper = styled.div`
  display: flex;
`;

const WorkspaceHomepage: NextPage = () => {
  const router = useRouter();
  const { workspaceId: id } = router.query;

  const [{ data, fetching, error }] = useGetWorkspaceByIdQuery({
    variables: { id },
  });

  const workspaceTitle = data?.workspace.title || "No title!";
  return (
    <>
      <Head title={fetching ? "Loading..." : workspaceTitle} />
      <PageLayout>
        <Header />
        <ContentWrapper>
          <Navigation workspaceId={id} workspaceTitle={workspaceTitle} />
          <PageContent>
            <MainHeading>{workspaceTitle}</MainHeading>
            <H2>Most recent items</H2>
            {error && <p> Oh no... {error?.message} </p>}
          </PageContent>
        </ContentWrapper>
      </PageLayout>
    </>
  );
};

export default withUrqlClient(WorkspaceHomepage);
