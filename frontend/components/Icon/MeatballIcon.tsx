import React from "react";

interface Props {
  className?: string;
}

const MeatballIcon = ({ className }: Props) => (
  <div className={`icon-wrapper logout-icon-wrapper ${className || ""}`}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 12a2 2 0 104 0 2 2 0 00-4 0zm-5 2a2 2 0 110-4 2 2 0 010 4zm-7 0a2 2 0 110-4 2 2 0 010 4z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default MeatballIcon;
