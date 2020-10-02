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

const FlexContainer = styled.div`
  ${({ theme }) => `
    border-top: 1px solid ${theme.colorNhsukGrey5};
  `}
  display: flex;
  flex-direction: column;
  > div {
    padding-bottom: 20px;
    outline: 1px solid red;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex: row;
`;

const FileTitle = styled.p`
  text-decoration: underline;
  font-weight: 700;
  ${({ theme }) => `
    color: ${theme.colorNhsukBlack};
  `}
`;

const FileListItem = ({ file }: Props) => (
  <FlexContainer>
    <TitleContainer>
      <img src={fileImage} alt="File icon" />
      <a>
        <FileTitle>{file.title}</FileTitle>
      </a>
    </TitleContainer>
    <div>
      <h3>Last modified</h3>
      <p>{file.modified}</p>
    </div>
    <div>
      <a>Download file</a>
    </div>
  </FlexContainer>
);

export default FileListItem;
