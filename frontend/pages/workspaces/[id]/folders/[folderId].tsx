import React from "react";

import { GraphQLClient } from "graphql-request";
import { GetServerSideProps } from "next";
import styled from "styled-components";

import { Head } from "../../../../components/Head";
import { Header } from "../../../../components/Header";
import { MainHeading } from "../../../../components/MainHeading";
// import { Navigation } from "../../../../components/Navigation";
import { PageLayout } from "../../../../components/PageLayout";
import { requireAuthentication } from "../../../../lib/auth";
import { getSdk, Folder } from "../../../../lib/generated/graphql";

export const getServerSideProps: GetServerSideProps<Props> = requireAuthentication(
  async (context) => {
    const client = new GraphQLClient(
      "http://workspace-service.workspace-service/graphql"
    );
    const sdk = getSdk(client);
    const folderId = (context.params?.folderId as string) || "";

    const { folder } = await sdk.GetFolderById({ id: folderId });
    // const { foldersByWorkspace } = await sdk.FoldersByWorkspace({
    //   workspace: workspaceId,
    // });

    return {
      props: {
        // folders: foldersByWorkspace,
        folder,
      },
    };
  }
);

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

interface Props {
  folder: Folder;
  // workspace: Workspace;
}
const FolderHomepage = ({ folder }: Props) => (
  <>
    <Head title={folder.title} />
    <PageLayout>
      <Header />
      <ContentWrapper>
        {/* <Navigation workspace={workspace} folders={workspace.folders} /> */}
        <PageContent>
          <MainHeading>{folder.title}</MainHeading>
          <p>{folder.description}</p>
        </PageContent>
      </ContentWrapper>
    </PageLayout>
  </>
);

export default FolderHomepage;
