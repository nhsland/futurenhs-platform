import React, { FC, ReactNode } from "react";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: baseline;
`;

const H1 = styled.h1`
  flex-grow: 1;
  font-size: 40px;
  line-height: 1.25;
  overflow-wrap: break-word;
  padding-top: 24px;
  width: 0px;
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
const MainHeading: FC<Props> = ({ children, menu }) => {
  return (
    <>
      <Container>
        <H1 aria-live="polite">{children}</H1>
        {menu}
      </Container>
    </>
  );
};

export default MainHeading;
