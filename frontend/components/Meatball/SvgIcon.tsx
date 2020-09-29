import * as React from "react";

import styled, { withTheme, ThemeProps } from "styled-components";

const Svg = styled.svg`
  width: 24px;
  height: 24px;
`;

interface Theme {
  colorNhsukBlack: string;
  colorNhsukBlue: string;
  colorNhsukWhite: string;
  colorNhsukYellow: string;
}

interface LocalProps {
  active: boolean;
}

type Props = LocalProps & ThemeProps<Theme>;

const SvgIcon: React.FC<Props> = (props: Props) => {
  const active = props.active;
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        width={24}
        height={24}
        rx={4}
        fill={
          active ? props.theme.colorNhsukYellow : props.theme.colorNhsukBlue
        }
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 12a2 2 0 104 0 2 2 0 00-4 0zm-5 2a2 2 0 110-4 2 2 0 010 4zm-7 0a2 2 0 110-4 2 2 0 010 4z"
        fill={
          active ? props.theme.colorNhsukBlack : props.theme.colorNhsukWhite
        }
      />
    </Svg>
  );
};

export default withTheme(SvgIcon);
