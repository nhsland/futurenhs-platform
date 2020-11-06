import React from "react";

interface Props {
  className?: string;
}

const MinusIcon = ({ className }: Props) => (
  <div className={`icon-wrapper ${className || ""}`}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="8" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.3333 12.5C17.3333 11.7636 16.7364 11.1667 16 11.1667H8L7.87159 11.1728C7.19546 11.2374 6.66667 11.8069 6.66667 12.5C6.66667 13.2364 7.26362 13.8333 8 13.8333H16L16.1284 13.8272C16.8045 13.7626 17.3333 13.1931 17.3333 12.5Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default MinusIcon;
