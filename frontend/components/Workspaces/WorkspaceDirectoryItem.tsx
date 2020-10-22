import React from "react";

import Link from "next/link";
import styled from "styled-components";

const StyledContainer = styled.div`
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
  ${({ theme }) => `
  display: flex;
  text-decoration: none;

  h4 {
    margin-bottom: 0px;

    &:hover {
      text-decoration: underline;
      cursor: pointer;
      }

    &:active {
      color: ${theme.colorNhsukBlack};
      text-decoration: none;
      background-color: ${theme.colorNhsukYellow};
      }
    }
 `}
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
          <h4>{title}</h4>
        </StyledLink>
      </Link>
    </StyledContainer>
  );
};

export default WorkspaceDirectoryItem;
