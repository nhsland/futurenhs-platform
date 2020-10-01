import React from "react";

interface Props {
  className?: string;
}

const Icon = ({ className }: Props) => (
  <div className={`icon-wrapper logout-icon-wrapper ${className || ""}`}>
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
        d="M21.12 11.592L17.844 7.99202C17.6722 7.82034 17.415 7.76656 17.1887 7.85499C16.9625 7.94341 16.8099 8.15729 16.8 8.40002V10.8H3.60002C2.93728 10.8 2.40002 11.3373 2.40002 12C2.40002 12.6628 2.93728 13.2 3.60002 13.2H16.8V15.6C16.8032 15.8452 16.9553 16.0638 17.184 16.152C17.255 16.1689 17.329 16.1689 17.4 16.152C17.5678 16.1503 17.7279 16.0811 17.844 15.96L21.12 12.36C21.3053 12.1375 21.3053 11.8145 21.12 11.592Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default Icon;
