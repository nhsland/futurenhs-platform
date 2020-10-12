import React from "react";

import { parseISO, format } from "date-fns";
import Link from "next/link";
import { Table } from "nhsuk-react-components";
import styled from "styled-components";

import { File } from "../../lib/generated/graphql";
import { FileIcon } from "../Icon";

interface Props {
  file: Pick<File, "title" | "id" | "fileType" | "folder" | "modifiedAt">;
  workspaceId: string;
  titleLink: boolean;
}

// Mobile
const ListItem = styled.li`
  align-items: flex-start;
  display: flex;
  padding-top: 16px;
  padding-bottom: 16px;
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
  a {
    text-decoration: underline;
    font-size: 16px;
  }
`;

const MobileTitle = styled.p`
  padding-bottom: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colorNhsukBlack};
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
        <a>Download file</a>
      </RHContainer>
    </ListItem>
  );
};

const List = styled.ul`
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
  margin: 0 0 8px -32px;
  margin-top: 0px;
  padding: 8px 32px;
  position: relative;
  top: -16px;
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

// Tablet and Desktop
interface FileTableProps {
  files: Pick<File, "title" | "id" | "folder" | "fileType" | "modifiedAt">[];
  workspaceId: string;
  tableHeading?: string;
  titleLink: boolean;
}

const TableContainer = styled.div`
  display: none;
  width: 100%;
  ${({ theme }) => `
  @media (min-width: ${theme.mqBreakpoints.tablet}) {
      display: block;
    }
  `}
  a {
    text-decoration: underline;
  }
  > div {
    ${({ theme }) => `
      background: ${theme.colorNhsukGrey5};
  `}
  }
`;

const Title = styled.span`
  font-weight: 700;
`;

const NHSTable = styled(Table)`
  tbody tr:hover {
    background: white;
  }
`;

export const FileTable = ({
  files,
  workspaceId,
  titleLink,
  tableHeading,
}: FileTableProps) => (
  <TableContainer>
    <Table.Panel heading={tableHeading}>
      <NHSTable>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Title</Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell>Last modified</Table.Cell>
            <Table.Cell>Actions</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {files.map((file) => {
            const modifiedAt = format(parseISO(file.modifiedAt), "LLL d, yyyy");
            return (
              <Table.Row key={file.id}>
                <Table.Cell>
                  <FileIcon fileType={file.fileType} />
                </Table.Cell>
                <Table.Cell>
                  {titleLink ? (
                    <Link
                      href={`/workspaces/${workspaceId}/folders/${file.folder}/files/${file.id}`}
                      passHref
                    >
                      <a>
                        <Title>{file.title}</Title>
                      </a>
                    </Link>
                  ) : (
                    <Title>{file.title}</Title>
                  )}
                </Table.Cell>
                <Table.Cell>{modifiedAt}</Table.Cell>
                <Table.Cell>
                  <a style={{ display: "inline-block", paddingRight: "8px" }}>
                    Download file
                  </a>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </NHSTable>
    </Table.Panel>
  </TableContainer>
);
