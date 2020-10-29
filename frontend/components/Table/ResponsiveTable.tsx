import React, { ReactNode } from "react";

import { MobileList } from "./MobileList";
import { Table } from "./Table";

// TODO: extract these into a components/Table/types.tsx and share them.
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

export const ResponsiveTable = <ItemType extends Item>({
  columns,
  data,
  tableHeading,
  extraDetails,
  icon,
}: Props<ItemType>) => (
  <>
    <MobileList
      columns={columns}
      data={data}
      tableHeading={tableHeading}
      icon={icon}
      extraDetails={extraDetails}
    />
    <Table
      columns={columns}
      data={data}
      tableHeading={tableHeading}
      icon={icon}
      extraDetails={extraDetails}
    />
  </>
);
