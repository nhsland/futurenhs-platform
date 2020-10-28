import React from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";
import styled from "styled-components";

import { H2 } from "../../../components/H2";
import { Head } from "../../../components/Head";
import { MainHeading } from "../../../components/MainHeading";
import { NavHeader } from "../../../components/NavHeader";
import { Navigation } from "../../../components/Navigation";
import { PageLayout } from "../../../components/PageLayout";
import { useGetWorkspaceByIdQuery } from "../../../lib/generated/graphql";
import withUrqlClient from "../../../lib/withUrqlClient";

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

const ContentWrapper = styled.div`
  display: flex;
`;

const WorkspaceHomepage: NextPage = () => {
  const router = useRouter();
  const { workspaceId } = router.query;
  const id = (workspaceId || "unknown").toString();

  const [{ data, fetching, error }] = useGetWorkspaceByIdQuery({
    variables: { id },
  });

  const workspaceTitle = (!fetching && data?.workspace.title) || "Loading...";

  return (
    <>
      <Head title={workspaceTitle} />
      <PageLayout>
        <NavHeader />
        <ContentWrapper>
          <Navigation workspaceId={id} workspaceTitle={workspaceTitle} />
          <PageContent>
            <MainHeading>{workspaceTitle}</MainHeading>
            <H2 title="Most recent items" />
            {error && <p> Oh no... {error?.message} </p>}
          </PageContent>
        </ContentWrapper>
      </PageLayout>
    </>
  );
};

export default withUrqlClient(WorkspaceHomepage);
