import React from "react";

import { useRouter } from "next/router";
import styled from "styled-components";

import {
  File,
  MobileFileList,
  FileTable,
} from "../../../../../../components/FileTable";
import { Head } from "../../../../../../components/Head";
import { MainHeading } from "../../../../../../components/MainHeading";
import { NavHeader } from "../../../../../../components/NavHeader";
import { Navigation } from "../../../../../../components/Navigation";
import { PageLayout } from "../../../../../../components/PageLayout";
import { useGetWorkspaceByIdQuery } from "../../../../../../lib/generated/graphql";
import withUrqlClient from "../../../../../../lib/withUrqlClient";

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

const Description = styled.p`
  padding-bottom: 40px;
`;

const file: File = {
  id: "123-34erg",
  title: "file title",
  description: "A description of the file",
  fileName: "file-title.pdf",
  url: "path/to/file",
  modified: "Sep 20, 2020",
  type: "pdf",
};

const data = {
  file,
};

const FileHomepage = () => {
  const router = useRouter();
  let { workspaceId, folderId } = router.query;
  workspaceId = (workspaceId || "unknown").toString();
  folderId = (folderId || "unknown").toString();

  const [workspace] = useGetWorkspaceByIdQuery({
    variables: { id: workspaceId },
  });

  return (
    <>
      <Head title={file.title} />
      <PageLayout>
        <NavHeader />
        <ContentWrapper>
          <Navigation
            workspaceId={workspaceId}
            workspaceTitle={workspace.data?.workspace.title || "unknown"}
            activeFolder={folderId}
          />
          <PageContent>
            <MainHeading withBorder>{data.file.title}</MainHeading>
            <h2>Description</h2>
            <Description>{data.file.description}</Description>
            <h3>File</h3>
            <MobileFileList files={[file]} />
            <FileTable files={[file]} />
          </PageContent>
        </ContentWrapper>
      </PageLayout>
    </>
  );
};

export default withUrqlClient(FileHomepage);
