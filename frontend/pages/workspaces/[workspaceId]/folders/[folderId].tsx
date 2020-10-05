import React from "react";

import { NextPage } from "next";
import { useRouter } from "next/router";
import styled from "styled-components";

import {
  File,
  MobileFileList,
  FileTable,
} from "../../../../components/FileTable";
import { Head } from "../../../../components/Head";
import { MainHeading } from "../../../../components/MainHeading";
import { NavHeader } from "../../../../components/NavHeader";
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

const TableContainer = styled.div`
  display: none;
  ${({ theme }) => `
  @media (min-width: ${theme.mqBreakpoints.tablet}) {
      display: block;
      width: 360px;
    }
  `}
`;

const FolderHomepage: NextPage = () => {
  const router = useRouter();
  let { workspaceId, folderId } = router.query;
  workspaceId = (workspaceId || "unknown").toString();
  folderId = (folderId || "unknown").toString();

  const [workspace] = useGetWorkspaceByIdQuery({
    variables: { id: workspaceId },
  });
  const [folder] = useGetFolderByIdQuery({
    variables: { id: folderId },
  });

  const file: File = {
    id: "id-for-file-1",
    title: "file title",
    description: "A description of the file",
    fileName: "file-title.pdf",
    url: "path/to/file",
    modified: "Sep 20, 2020",
    type: "pdf",
  };

  const fileTwo: File = {
    id: "id-for-file-2",
    title: "file 2 title",
    description: "A description of the file",
    fileName: "file-title-2.pdf",
    url: "path/to/file",
    modified: "Sep 20, 2020",
    type: "pdf",
  };

  const files = [file, fileTwo];

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
        <NavHeader />
        <ContentWrapper>
          <Navigation
            workspaceId={workspaceId}
            workspaceTitle={workspace.data?.workspace.title || "unknown"}
            activeFolder={folderId}
          />
          <PageContent>
            <MainHeading withBorder>
              {folder.data?.folder.title || ""}
            </MainHeading>
            <p>{folder.data?.folder.description}</p>
            {folder.error && <p> Oh no... {folder.error?.message} </p>}
            <h3>Files</h3>
            <MobileFileList files={files}></MobileFileList>
            <TableContainer>
              <FileTable files={files} />
            </TableContainer>
          </PageContent>
        </ContentWrapper>
      </PageLayout>
    </>
  );
};

export default withUrqlClient(FolderHomepage);
