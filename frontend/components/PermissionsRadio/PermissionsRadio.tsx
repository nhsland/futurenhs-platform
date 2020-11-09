import React, { HTMLProps } from "react";

import { Radios } from "nhsuk-react-components";
import FormGroup from "nhsuk-react-components/lib/util/FormGroup";
import { FormElementProps } from "nhsuk-react-components/lib/util/types/FormTypes";
import styled from "styled-components";

interface PermissionsRadioProps
  extends HTMLProps<HTMLInputElement>,
    FormElementProps {
  inputRef?: (inputRef: HTMLInputElement | null) => any;
}

const StyledRadios = styled(Radios)`
  .nhsuk-radios__label,
  .nhsuk-radios__hint {
    padding-left: 28px;
    padding-top: 0px;
  }
`;

const PermissionsRadio: React.FC<PermissionsRadioProps> = ({ inputRef }) => (
  <FormGroup inputType="radios">
    {() => (
      <StyledRadios name="roleRequired" id="roleRequired">
        <Radios.Radio
          inputRef={inputRef}
          value="PLATFORM_MEMBER"
          id="all-members"
          hint="This will make the folder and its contents visible to all members of FutureNHS"
        >
          Make visible to all FutureNHS members
        </Radios.Radio>
        <Radios.Radio
          inputRef={inputRef}
          value="WORKSPACE_MEMBER"
          id="workspace-members"
          hint="This will make the folder and its contents visible to members of your workspace."
        >
          Make visible to all members of this workspace
        </Radios.Radio>
      </StyledRadios>
    )}
  </FormGroup>
);

export default PermissionsRadio;
