import React, { ReactNode } from "react";

import styled from "styled-components";

const ListItem = styled.li`
  align-items: flex-start;
  display: flex;
  padding-top: 16px;
  padding-bottom: 26px;
  border-bottom: 1px solid ${({ theme }) => theme.colorNhsukGrey4};
`;

const RHContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  > div {
    padding-bottom: 10px;
  }
  p,
  h4 {
    margin-bottom: 0;
    font-size: 16px;
  }
  p {
    color: ${({ theme }) => theme.colorNhsukGrey1};
  }
  a {
    font-size: 16px;
  }
`;

const List = styled.ul`
  padding-top: 20px;
  padding-left: 12px;
  padding-right: 16px;
  ${({ theme }) => `
    background: ${theme.colorNhsukGrey5};
    @media (min-width: ${theme.mqBreakpoints.tablet}) {
      display: none;
    }
  `}
`;

const Heading = styled.h3`
  background-color: #005eb8;
  color: ${({ theme }) => theme.colorNhsukWhite};
  display: inline-block;
  font-size: 1.5rem;
  line-height: 1.33333;
  padding: 8px 32px;
  position: relative;
  top: 34px;
  ${({ theme }) => `
    @media (min-width: ${theme.mqBreakpoints.tablet}) {
      display: none;
    }
  `}
`;

interface Item {
  id: string;
}

interface Props<ItemType extends Item> {
  columns: Array<{
    content: (x: ItemType) => ReactNode;
  }>;
  data: ItemType[];
  tableHeading?: string;
}

export const MobileList = <ItemType extends Item>({
  columns: [columnsHead, ...columnsTail],
  data,
  tableHeading,
}: Props<ItemType>) => (
  <>
    {tableHeading && <Heading>{tableHeading}</Heading>}
    <List>
      {data.map((x) => (
        <ListItem key={x.id}>
          {columnsHead?.content(x)}
          <RHContainer>
            {columnsTail?.map((c, i) => (
              <div key={i}>{c.content(x)}</div>
            ))}
          </RHContainer>
        </ListItem>
      ))}
    </List>
  </>
);
