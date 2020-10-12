import React from "react";

import { parseISO, format } from "date-fns";
import Link from "next/link";
import styled from "styled-components";

import { File } from "../../lib/generated/graphql";
import { FileIcon } from "../Icon";

interface Props {
  file: Pick<File, "title" | "id" | "fileType" | "folder" | "modifiedAt">;
  workspaceId: string;
  titleLink: boolean;
}

interface FileTableProps {
  files: Pick<File, "title" | "id" | "folder" | "fileType" | "modifiedAt">[];
  workspaceId: string;
  tableHeading?: string;
  titleLink: boolean;
}

// Mobile
const ListItem = styled.li`
  align-items: flex-start;
  display: flex;
  padding-top: 16px;
  padding-bottom: 26px;
  border-bottom: 1px solid ${({ theme }) => theme.colorNhsukGrey4};
`;

const RHContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  > div {
    padding-bottom: 20px;
  }
  p,
  h4 {
    margin-bottom: 0;
    font-size: 18px;
  }
  p {
    color: ${({ theme }) => theme.colorNhsukGrey1};
  }
  a {
    font-size: 16px;
  }
`;

const MobileTitle = styled.p`
  padding-bottom: 20px;
`;

const FileListItem = ({ file, workspaceId, titleLink }: Props) => {
  const modifiedAt = format(parseISO(file.modifiedAt), "LLL d, yyyy");
  return (
    <ListItem>
      <FileIcon fileType={file.fileType} />
      <RHContainer>
        {titleLink ? (
          <MobileTitle>
            <Link
              href={`/workspaces/${workspaceId}/folders/${file.folder}/files/${file.id}`}
              passHref
            >
              <a>{file.title}</a>
            </Link>
          </MobileTitle>
        ) : (
          <MobileTitle>{file.title}</MobileTitle>
        )}

        <div>
          <h4>Last modified</h4>
          <p>{modifiedAt}</p>
        </div>
        <Link href="" passHref>
          <a>Download file</a>
        </Link>
      </RHContainer>
    </ListItem>
  );
};

const List = styled.ul`
  padding-top: 20px;
  padding-left: 12px;
  padding-right: 16px;
  ${({ theme }) => `
    background: ${theme.colorNhsukGrey5};
    @media (min-width: ${theme.mqBreakpoints.tablet}) {
      display: none;
    }
  `}
`;

const Heading = styled.h3`
  font-size: 1.5rem;
  line-height: 1.33333;
  background-color: #005eb8;
  color: #ffffff;
  display: inline-block;
  /* margin-top: 0px; */
  /* margin-bottom: -40px; */
  padding: 8px 32px;
  position: relative;
  top: 34px;
  /* position: relative; */
  /* top: -16px; */
  ${({ theme }) => `
    @media (min-width: ${theme.mqBreakpoints.tablet}) {
      display: none;
    }
  `}
`;

export const MobileFileList = ({
  files,
  workspaceId,
  titleLink,
  tableHeading,
}: FileTableProps) => (
  <>
    <Heading>{tableHeading}</Heading>
    <List>
      {files.map((file) => (
        <FileListItem
          key={file.id}
          file={file}
          workspaceId={workspaceId}
          titleLink={titleLink}
        />
      ))}
    </List>
  </>
);
