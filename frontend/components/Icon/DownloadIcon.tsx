import React from "react";

interface Props {
  className?: string;
}

const Icon = ({ className }: Props) => (
  <div className={`icon-wrapper ${className || ""}`}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 19.6923V22H4V19.6923H20ZM13.1443 2V13.3462L16.75 9.8125L18.2955 11.3269L12.1136 17.3846L5.93182 11.3269L7.47727 9.8125L11.083 13.3462V2H13.1443Z"
        fill="#005EB8"
      />
    </svg>
  </div>
);

export default Icon;
