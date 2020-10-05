import React from "react";

import { Table } from "nhsuk-react-components";
import styled from "styled-components";

import { FileIcon } from "../Icon";

export interface File {
  id: string;
  title: string;
  description: string;
  fileName: string;
  url: string;
  modified: string;
  type: string;
}

interface Props {
  file: File;
}

const ListItem = styled.li`
  align-items: flex-start;
  display: flex;
  padding-top: 16px;
  padding-bottom: 16px;
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

const Title = styled.a`
  padding-bottom: 20px;
  font-weight: 700;
  ${({ theme }) => `
    color: ${theme.colorNhsukBlack};
  `}
`;

interface FileTableProps {
  files: File[];
}

export const FileTable = ({ files }: FileTableProps) => (
  <Table>
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
            <FileIcon fileType={file.type} />
          </Table.Cell>
          <Table.Cell>{file.title}</Table.Cell>
          <Table.Cell>{file.modified}</Table.Cell>
          <Table.Cell>
            <a>Download file</a>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

const FileListItem = ({ file }: Props) => (
  <ListItem>
    <FileIcon fileType={file.type} />
    <RHContainer>
      <Title>{file.title}</Title>
      <div>
        <h4>Last modified</h4>
        <p>{file.modified}</p>
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
    border-bottom: 1px solid ${theme.colorNhsukGrey4};
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
