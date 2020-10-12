import React from "react";

import { parseISO, format } from "date-fns";
import Link from "next/link";
import { Table } from "nhsuk-react-components";
import styled from "styled-components";

import { File } from "../../lib/generated/graphql";
import { FileIcon } from "../Icon";

const TableContainer = styled.div`
  display: none;
  width: 100%;
  ${({ theme }) => `
  @media (min-width: ${theme.mqBreakpoints.tablet}) {
      display: block;
    }
  `}
  > div {
    ${({ theme }) => `
      background: ${theme.colorNhsukGrey5};
  `}
  }
`;

const NHSTable = styled(Table)`
  tbody tr:hover {
    background: ${({ theme }) => theme.colorNhsukWhite};
  }
`;

const ModifiedDate = styled(Table.Cell)`
  color: ${({ theme }) => theme.colorNhsukGrey1};
`;

const DownloadFile = styled.a`
  display: inline-block;
  padding-right: 8px;
`;

interface Props {
  files: Pick<File, "title" | "id" | "folder" | "fileType" | "modifiedAt">[];
  workspaceId: string;
  tableHeading?: string;
  titleLink: boolean;
}

export const FileTable = ({
                            files,
                            workspaceId,
                            titleLink,
                            tableHeading,
                          }: Props) => (
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
                    >
                      <a>
                        <span>{file.title}</span>
                      </a>
                    </Link>
                  ) : (
                    <span>{file.title}</span>
                  )}
                </Table.Cell>
                <ModifiedDate>{modifiedAt}</ModifiedDate>
                <Table.Cell>
                  <Link href={`/workspaces/${workspaceId}/download/${file.id}`} passHref>
                    <DownloadFile>Download file</DownloadFile>
                  </Link>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </NHSTable>
    </Table.Panel>
  </TableContainer>
);
