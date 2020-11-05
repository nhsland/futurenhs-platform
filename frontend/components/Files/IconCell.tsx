import React, { FC } from "react";

import { File } from "../../lib/generated/graphql";
import { FileIcon } from "../Icon";

export const IconCell: FC<File> = ({ fileType }) => (
  <FileIcon fileType={fileType} />
);
