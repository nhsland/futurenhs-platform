import React from "react";

import { useRouter } from "next/router";
import styled from "styled-components";

import {
  MobileFileList,
  FileTable,
} from "../../../../../../components/FileTable";
import { Head } from "../../../../../../components/Head";
import { DeleteIcon } from "../../../../../../components/Icon";
import { MainHeading } from "../../../../../../components/MainHeading";
import { Menu } from "../../../../../../components/Menu";
import { NavHeader } from "../../../../../../components/NavHeader";
import { Navigation } from "../../../../../../components/Navigation";
import { PageLayout } from "../../../../../../components/PageLayout";
import {
  useGetWorkspaceByIdQuery,
  useGetFileByIdQuery,
  useDeleteFileMutation,
} from "../../../../../../lib/generated/graphql";
import withUrqlClient from "../../../../../../lib/withUrqlClient";

const PageContent = styled.section`
  flex-grow: 3;
  min-height: 100vh;
  padding-top: 24px;
  padding-left: 16px;
  padding-right: 16px;
  ${({ theme }) => `
    background-color: ${theme.colorNhsukWhite};
    @media (min-width: ${theme.mqBreakpoints.tablet}) {
      padding-left: 20px;
      padding-right: 20px;
    }
    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      padding-left: 32px;
      padding-right: 32px;
    }
  `}
`;

const ContentWrapper = styled.div`
  display: flex;
`;

const Description = styled.p`
  padding-bottom: 40px;
`;

const FileHomepage = () => {
  const router = useRouter();
  let { workspaceId, folderId, fileId } = router.query;
  workspaceId = (workspaceId || "unknown").toString();
  folderId = (folderId || "unknown").toString();
  fileId = (fileId || "unknown").toString();

  const [workspace] = useGetWorkspaceByIdQuery({
    variables: { id: workspaceId },
  });

  const [file] = useGetFileByIdQuery({
    variables: { id: fileId },
  });

  const [, deleteFolder] = useDeleteFileMutation();

  const deleteFile = () => {
    const message = "Are you sure you want to delete this file?";
    const result = window.confirm(message);
    if (result) {
      const someFileId = "asdfsafsdfsaf";
      deleteFolder({ id: someFileId });
      router.push(`/workspaces/${workspaceId}/folders/${folderId}`);
    }
  };

  return (
    <>
      <Head title={`File - ${file.data?.file.title || "Loading..."}`} />
      <PageLayout>
        <NavHeader />
        <ContentWrapper>
          <Navigation
            workspaceId={workspaceId}
            workspaceTitle={workspace.data?.workspace.title || "unknown"}
            activeFolder={folderId}
          />
          <PageContent>
            <MainHeading
              withBorder
              menu={
                <Menu
                  items={[
                    {
                      title: "Delete file",
                      icon: <DeleteIcon />,
                      href: "#",
                      isButton: true,
                      onClick: deleteFile,
                    },
                  ]}
                />
              }
            >
              {file.data?.file.title || "Loading..."}
            </MainHeading>
            <h2>Description</h2>
            <button
              onClick={() => {
                const message = "Are you sure you want to delete this file?";
                const result = window.confirm(message);
                if (result) {
                  const someFileId = "asdfsafsdfsaf";
                  deleteFolder({ id: someFileId });
                  router.push(`/workspaces/${workspaceId}/folders/${folderId}`);
                }
              }}
            >
              Delete folder
            </button>
            <Description>
              {file.data?.file.description || "Loading..."}
            </Description>
            {file.error && <p> Oh no... {file.error?.message} </p>}
            {file.fetching || !file.data ? (
              "Loading..."
            ) : (
              <>
                <MobileFileList
                  files={[file.data.file]}
                  workspaceId={workspaceId}
                  titleLink={false}
                />
                <FileTable
                  files={[file.data.file]}
                  workspaceId={workspaceId}
                  titleLink={false}
                />
              </>
            )}
          </PageContent>
        </ContentWrapper>
      </PageLayout>
    </>
  );
};

export default withUrqlClient(FileHomepage);
