import React from "react";

import Link from "next/link";
import styled from "styled-components";

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 40px;
  img {
    padding-right: 24px;
    border-radius: 4px;
    height: 44px;
    display: block;
  }
`;

const StyledLink = styled.a`
  display: flex;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  &:active {
    ${({ theme }) => `
        color: ${theme.colorNhsukBlack};
        background-color: ${theme.colorNhsukYellow};
      `}
    text-decoration: none;
  }

  div {
    margin-bottom: 0px;
    font-size: 22px;
    font-weight: 600;
  }
`;

interface Props {
  title: string;
  id: string;
}

const WorkspaceDirectoryItem = ({ title, id }: Props) => {
  return (
    <StyledContainer>
      <img
        src={require("../../public/Placeholder_Workspace_Image.svg")}
        alt=""
      />
      <Link href="/workspaces/[id]" as={`/workspaces/${id}`} passHref>
        <StyledLink>
          <div>{title}</div>
        </StyledLink>
      </Link>
    </StyledContainer>
  );
};

export default WorkspaceDirectoryItem;
