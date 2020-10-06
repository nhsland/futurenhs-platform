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
        d="M20 4.30769V2H4V4.30769H20ZM13.1443 22V10.6538L16.75 14.1875L18.2955 12.6731L12.1136 6.61539L5.93182 12.6731L7.47727 14.1875L11.083 10.6538V22H13.1443Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default Icon;
