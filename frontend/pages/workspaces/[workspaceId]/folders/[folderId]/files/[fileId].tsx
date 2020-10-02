import React from "react";

import { useRouter } from "next/router";
import styled from "styled-components";

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

const FileHomepage = () => {
  const router = useRouter();
  let { workspaceId, folderId } = router.query;
  workspaceId = (workspaceId || "unknown").toString();
  folderId = (folderId || "unknown").toString();

  const [workspace] = useGetWorkspaceByIdQuery({
    variables: { id: workspaceId },
  });

  const data = {
    file: {
      id: "123-34erg",
      // title: 'Something PDF - Single File Homepage',
      filename: "something.pdf",
      type: "something.pdf",
      path: "path/to/file",
      description: "This is the document that says the things",
    },
  };
  // const fetching = false;
  // const error = ;

  return (
    <>
      <Head title="file title" />
      <PageLayout>
        <NavHeader />
        <ContentWrapper>
          <Navigation
            workspaceId={workspaceId}
            workspaceTitle={workspace.data?.workspace.title || "unknown"}
            activeFolder={folderId}
          />
          <PageContent>
            <MainHeading withBorder>{data.file.filename}</MainHeading>
            <h2>Description</h2>
            <p>{data.file.description}</p>
            <h3>Files</h3>
            <div>
              <div id="icon"></div>
              {data.file.filename}
            </div>
          </PageContent>
        </ContentWrapper>
      </PageLayout>
    </>
  );
};

export default withUrqlClient(FileHomepage);
