import React, { HTMLProps } from "react";

import classNames from "classnames";
import FormGroup from "nhsuk-react-components/lib/util/FormGroup";
import { FormElementProps } from "nhsuk-react-components/lib/util/types/FormTypes";

// For now, we need to create our own Textarea component in order to make use of ref - unlike the 'input' component, textarea from the NHS components library does not expose 'inputRef'
interface TextareaProps
  extends HTMLProps<HTMLTextAreaElement>,
    FormElementProps {
  inputRef?: (inputRef: HTMLTextAreaElement | null) => any;
}
const Textarea: React.FC<TextareaProps> = (props) => (
  <FormGroup<TextareaProps> inputType="textarea" {...props}>
    {({ className, error, inputRef, ...rest }) => (
      <textarea
        className={classNames(
          "nhsuk-textarea",
          { "nhsuk-textarea--error": error },
          className
        )}
        ref={inputRef}
        {...rest}
      />
    )}
  </FormGroup>
);

export default Textarea;
