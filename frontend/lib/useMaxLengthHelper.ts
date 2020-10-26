import { useState } from "react";

export const useMaxLengthHelper = (fieldTitle: string, maxLength: number) => {
  const [currentLength, setCurrentLength] = useState<{
    [key: string]: number | undefined;
  }>({});

  const onChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentLength({
      ...currentLength,
      [event.currentTarget.name]: event.currentTarget.value.length,
    });
  };

  const remainingText = (fieldName: string) =>
    `${Math.max(
      0,
      maxLength - (currentLength[fieldName] ?? 0)
    )} characters remaining`;

  const validation = {
    maxLength: {
      value: maxLength,
      message: `${fieldTitle} must be a maximum of ${maxLength} characters`,
    },
  };

  return {
    onChange,
    remainingText,
    validation,
  };
};
