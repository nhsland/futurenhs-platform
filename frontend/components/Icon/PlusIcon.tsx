import React from "react";

interface Props {
  className?: string;
}

const PlusIcon = ({ className }: Props) => (
  <div className={`icon-wrapper ${className || ""}`}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM13.3272 7.87159C13.2626 7.19546 12.6931 6.66667 12 6.66667C11.2636 6.66667 10.6667 7.26362 10.6667 8L10.666 10.666L8 10.6667L7.87159 10.6728C7.19546 10.7374 6.66667 11.3069 6.66667 12C6.66667 12.7364 7.26362 13.3333 8 13.3333L10.666 13.333L10.6667 16L10.6728 16.1284C10.7374 16.8045 11.3069 17.3333 12 17.3333C12.7364 17.3333 13.3333 16.7364 13.3333 16L13.333 13.333L16 13.3333L16.1284 13.3272C16.8045 13.2626 17.3333 12.6931 17.3333 12C17.3333 11.2636 16.7364 10.6667 16 10.6667L13.333 10.666L13.3333 8L13.3272 7.87159Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default PlusIcon;
