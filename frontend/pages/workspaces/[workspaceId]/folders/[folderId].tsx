import React from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Head } from "../../../../components/Head";
import { Header } from "../../../../components/Header";
import { MainHeading } from "../../../../components/MainHeading";
import { Navigation } from "../../../../components/Navigation";
import { PageLayout } from "../../../../components/PageLayout";
import {
  useGetFolderByIdQuery,
  useGetWorkspaceByIdQuery,
} from "../../../../lib/generated/graphql";
import withUrqlClient from "../../../../lib/withUrqlClient";

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

const FolderHomepage: NextPage = () => {
  const router = useRouter();
  const { workspaceId, folderId } = router.query;

  const [workspace] = useGetWorkspaceByIdQuery({
    variables: { id: workspaceId },
  });
  const [folder] = useGetFolderByIdQuery({
    variables: { id: folderId },
  });

  return (
    <>
      <Head
        title={
          folder.fetching
            ? "Loading..."
            : folder.data?.folder.title || "No title!"
        }
      />
      <PageLayout>
        <Header />
        <ContentWrapper>
          <Navigation
            workspaceId={workspaceId}
            workspaceTitle={workspace.data?.workspace.title}
            activeFolder={folderId}
          />
          <PageContent>
            <MainHeading>{folder.data?.folder.title || ""}</MainHeading>
            <p>{folder.data?.folder.description}</p>
            {folder.error && <p> Oh no... {folder.error?.message} </p>}
          </PageContent>
        </ContentWrapper>
      </PageLayout>
    </>
  );
};

export default withUrqlClient(FolderHomepage);
