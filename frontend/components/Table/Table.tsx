import React, { ReactNode } from "react";

import { Table as NHSTable } from "nhsuk-react-components";
import styled from "styled-components";

const TableContainer = styled.div`
  display: none;
  width: 100%;
  ${({ theme }) => `
  @media (min-width: ${theme.mqBreakpoints.tablet}) {
      display: block;
    }
  `}
  > div {
    ${({ theme }) => `
      background: ${theme.colorNhsukGrey5};
  `}
  }
`;

const IconWrapper = styled.div`
  display: flex;
  .file-icon-wrapper {
    flex-shrink: 0;
    padding-right: 8px;
  }
`;

const StyledTable = styled(NHSTable)`
  tbody tr:hover {
    background: ${({ theme }) => theme.colorNhsukWhite};
  }
  td {
    font-size: 16px;
  }
`;

interface Item {
  id: string;
}

interface Props<ItemType extends Item> {
  columns: Array<{
    name?: string;
    content: (x: ItemType) => ReactNode;
  }>;
  extraDetails: Array<{
    name?: string;
    content: (x: ItemType) => ReactNode;
  }>;
  data: ItemType[];
  tableHeading?: string;
  icon?: (x: ItemType) => ReactNode;
}

const TableComponent = <ItemType extends Item>({
  columns,
  data,
  tableHeading,
  icon,
}: Props<ItemType>) => (
  <TableContainer>
    <NHSTable.Panel heading={tableHeading}>
      <StyledTable>
        <NHSTable.Head>
          <NHSTable.Row>
            {columns.map((c, i) => (
              <NHSTable.Cell key={i}>{c.name}</NHSTable.Cell>
            ))}
          </NHSTable.Row>
        </NHSTable.Head>
        <NHSTable.Body>
          {data.map((x) => (
            <NHSTable.Row key={x.id}>
              {columns.map(({ content }, i) => (
                <NHSTable.Cell key={i}>
                  {i === 0 && icon ? (
                    <IconWrapper>
                      {icon(x)}
                      {content(x)}
                    </IconWrapper>
                  ) : (
                    content(x)
                  )}
                </NHSTable.Cell>
              ))}
            </NHSTable.Row>
          ))}
        </NHSTable.Body>
      </StyledTable>
    </NHSTable.Panel>
  </TableContainer>
);

export { TableComponent as Table };
