import React from "react";

import { Table } from "nhsuk-react-components";
import styled from "styled-components";

import { File } from "../../lib/generated/graphql";
import { FileIcon } from "../Icon";

interface Props {
  file: Pick<
    File,
    "title" | "id" | "description" | "fileType" | "fileName" | "modifiedAt"
  >;
}

// Mobile
const ListItem = styled.li`
  align-items: flex-start;
  display: flex;
  padding-top: 16px;
  padding-bottom: 16px;
  ${({ theme }) => `
    border-bottom: 1px solid ${theme.colorNhsukGrey4};
  `}
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

const MobileTitle = styled.a`
  padding-bottom: 20px;
  font-weight: 700;
  ${({ theme }) => `
    color: ${theme.colorNhsukBlack};
  `}
`;

const FileListItem = ({ file }: Props) => (
  <ListItem>
    <FileIcon fileType={file.fileType} />
    <RHContainer>
      <MobileTitle>{file.title}</MobileTitle>
      <div>
        <h4>Last modified</h4>
        <p>{file.modifiedAt}</p>
      </div>
      <a>Download file</a>
    </RHContainer>
  </ListItem>
);

const List = styled.ul`
  padding-left: 0;
  padding-right: 16px;
  ${({ theme }) => `
    border-top: 1px solid ${theme.colorNhsukGrey4};
    @media (min-width: ${theme.mqBreakpoints.tablet}) {
      display: none;
    }
  `}
`;

export const MobileFileList = ({ files }: FileTableProps) => (
  <List>
    {files.map((file) => (
      <FileListItem key={file.id} file={file} />
    ))}
  </List>
);

// Tablet and Desktop
interface FileTableProps {
  files: Pick<
    File,
    "title" | "id" | "description" | "fileType" | "fileName" | "modifiedAt"
  >[];
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
`;

const Title = styled.a`
  font-weight: 700;
  ${({ theme }) => `
    color: ${theme.colorNhsukBlack};
  `}
`;

export const FileTable = ({ files }: FileTableProps) => (
  <TableContainer>
    <Table.Head>
      <Table.Row>
        <Table.Cell>Title</Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell>Last modified</Table.Cell>
        <Table.Cell>Actions</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {files.map((file) => (
        <Table.Row key={file.id}>
          <Table.Cell>
            <FileIcon fileType={file.fileType} />
          </Table.Cell>
          <Table.Cell>
            <Title>{file.title}</Title>
          </Table.Cell>
          <Table.Cell>{file.modifiedAt}</Table.Cell>
          <Table.Cell>
            <a>Download file</a>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </TableContainer>
);
