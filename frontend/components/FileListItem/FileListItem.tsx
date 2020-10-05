import React from "react";

import styled from "styled-components";

const fileImage = require("../../public/file.svg");

export interface File {
  id: string;
  title: string;
  description: string;
  fileName: string;
  url: string;
  modified: string;
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
  ${({ theme }) => `
  @media (min-width: ${theme.mqBreakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  `}
`;

const Title = styled.a`
  padding-bottom: 20px;
  font-weight: 700;
  ${({ theme }) => `
    color: ${theme.colorNhsukBlack};
  `}
`;

const FileListItem = ({ file }: Props) => (
  <ListItem>
    <img src={fileImage} alt="File icon" />
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

export const FileList = styled.ul`
  padding-left: 0;
  padding-right: 16px;
  ${({ theme }) => `
    border-top: 1px solid ${theme.colorNhsukGrey4};
    border-bottom: 1px solid ${theme.colorNhsukGrey4};
  `}
`;

export default FileListItem;
