import React, { FC, ReactNode } from "react";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const H1 = styled.h1`
  margin-bottom: 23px;
`;

const StyledHorizontalRule = styled.hr`
  margin-top: 0px;
  margin-bottom: 25px;
  ${({ theme }) => `
    color: ${theme.colorNhsukGrey1};
    border-bottom: 1px solid ${theme.colorNhsukGrey1};
  `}
`;

interface Props {
  children: string;
  withBorder?: boolean;
  menu?: ReactNode;
}

/**
 * This component should be used on every page as the main heading.
 * It's a workaround for a known next.js accessibility issue that doesn't read out
 * headlines on navigation
 */
const MainHeading: FC<Props> = ({ children, withBorder, menu }) => {
  return (
    <>
      <Container>
        <H1 aria-live="polite">{children}</H1>
        {menu}
      </Container>
      {withBorder && <StyledHorizontalRule />}
    </>
  );
};

export default MainHeading;
