import React, { FC } from "react";

import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import styled from "styled-components";
import { Client } from "urql";

import {
  IconCell,
  MobileModifiedAtCell,
  ModifiedAtCell,
  TitleCell,
} from "../../../../../../../components/Files";
import { Head } from "../../../../../../../components/Head";
import { MainHeading } from "../../../../../../../components/MainHeading";
import { NavHeader } from "../../../../../../../components/NavHeader";
import { Navigation } from "../../../../../../../components/Navigation";
import { PageLayout } from "../../../../../../../components/PageLayout";
import { MobileList, Table } from "../../../../../../../components/Table";
import { UpdateFileForm } from "../../../../../../../containers/UploadFileForm";
import {
  File,
  useGetFileByIdQuery,
  useGetWorkspaceByIdQuery,
} from "../../../../../../../lib/generated/graphql";
import withUrqlClient from "../../../../../../../lib/withUrqlClient";

const ContentWrapper = styled.div`
  display: flex;
`;

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

const DownloadFile = styled.a`
  display: inline-block;
  padding-right: 8px;
  font-size: 16px;
`;

const UpdateFile: NextPage<any> = ({ urqlClient }: { urqlClient: Client }) => {
  const router = useRouter();
  const { fileId, workspaceId, folderId } = router.query;

  if (fileId === undefined || Array.isArray(fileId)) {
    throw new Error("fileId required in URL");
  }

  if (folderId === undefined || Array.isArray(folderId)) {
    throw new Error("folderId required in URL");
  }

  if (workspaceId === undefined || Array.isArray(workspaceId)) {
    throw new Error("workspaceId required in URL");
  }

  const [workspace] = useGetWorkspaceByIdQuery({
    variables: { id: workspaceId },
  });

  const [file] = useGetFileByIdQuery({
    variables: { id: fileId },
  });

  if (workspace.error || file.error)
    return (
      <p>
        Oh no... {workspace.error?.message} {file.error?.message}{" "}
      </p>
    );

  const actionsCell: FC<File> = ({ id }) => (
    <Link href={`/workspaces/${workspaceId}/download/${id}`} passHref>
      <DownloadFile>Download file</DownloadFile>
    </Link>
  );

  const mobileActionsCell: FC<File> = ({ id }) => (
    <Link href={`/workspaces/${workspaceId}/download/${id}`} passHref>
      <a>Download file</a>
    </Link>
  );

  return (
    <>
      <Head title={`Upload new version - ${file.data?.file.title}`} />
      <PageLayout>
        <NavHeader />
        <ContentWrapper>
          <Navigation
            workspaceId={workspaceId}
            workspaceTitle={
              workspace.fetching
                ? "Loading..."
                : workspace.data?.workspace.title || "No title!"
            }
            activeFolder={folderId}
          />
          <PageContent>
            <MainHeading>Upload new version</MainHeading>

            {file.data && (
              <Table
                tableHeading="Current file"
                icon={IconCell}
                columns={[
                  { name: "Title", content: TitleCell },
                  { name: "Last modified", content: ModifiedAtCell },
                  { name: "Actions", content: actionsCell },
                ]}
                data={[file.data?.file as File]}
              />
            )}

            {file.data && (
              <MobileList
                tableHeading="Current file"
                icon={IconCell}
                columns={[
                  { content: TitleCell },
                  { content: MobileModifiedAtCell },
                  { content: mobileActionsCell },
                ]}
                data={[file.data?.file as File]}
              />
            )}

            <p> Fields marked with * are mandatory.</p>
            {file.data && (
              <UpdateFileForm
                urqlClient={urqlClient}
                workspaceId={workspaceId}
                folderId={folderId}
                fileDescription={file.data?.file.description}
                fileId={fileId}
                fileTitle={file.data?.file.title}
                latestVersionId={file.data?.file.latestVersion}
              />
            )}
          </PageContent>
        </ContentWrapper>
      </PageLayout>
    </>
  );
};

export default withUrqlClient(UpdateFile);
