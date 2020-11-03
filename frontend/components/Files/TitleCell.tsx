import React, { FC } from "react";

import { File } from "../../lib/generated/graphql";

export const TitleCell: FC<File> = ({ title }) => <>{title}</>;
