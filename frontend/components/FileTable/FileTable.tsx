import React from "react";

import { parseISO, format } from "date-fns";
import Link from "next/link";
import { Table } from "nhsuk-react-components";
import styled from "styled-components";

import { File } from "../../lib/generated/graphql";
import { FileIcon } from "../Icon";

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
    /* text-decoration: underline; */
  }
  > div {
    ${({ theme }) => `
      background: ${theme.colorNhsukGrey5};
  `}
  }
`;

const NHSTable = styled(Table)`
  tbody tr:hover {
    background: white;
  }
`;

const ModifiedDate = styled(Table.Cell)`
  color: ${({ theme }) => theme.colorNhsukGrey1};
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
                        <span>{file.title}</span>
                      </a>
                    </Link>
                  ) : (
                    <span>{file.title}</span>
                  )}
                </Table.Cell>
                <ModifiedDate>{modifiedAt}</ModifiedDate>
                <Table.Cell>
                  <Link href="" passHref>
                    <a style={{ display: "inline-block", paddingRight: "8px" }}>
                      Download file
                    </a>
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
