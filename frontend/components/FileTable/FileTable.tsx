import React, { ReactNode } from "react";

import { Table } from "nhsuk-react-components";
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

const NHSTable = styled(Table)`
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
  data: ItemType[];
  tableHeading?: string;
}

export const FileTable = <ItemType extends Item>({
  columns,
  data,
  tableHeading,
}: Props<ItemType>) => (
  <TableContainer>
    <Table.Panel heading={tableHeading}>
      <NHSTable>
        <Table.Head>
          <Table.Row>
            {columns.map((c, i) => (
              <Table.Cell key={i}>{c.name}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {data.map((x) => (
            <Table.Row key={x.id}>
              {columns.map(({ content }, i) => (
                <Table.Cell key={i}>{content(x)}</Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </NHSTable>
    </Table.Panel>
  </TableContainer>
);
