import React from "react";

interface Props {
  className?: string;
  title?: string;
  description?: string;
}

const ChevronBottomIcon = ({ className, title, description }: Props) => (
  <div className={`icon-wrapper ${className || ""}`}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="chevronBottomIconId chevronBottomIconDesc"
    >
      {title ? <title id="chevronBottomIconId">{title}</title> : ""}
      {description ? <desc id="chevronBottomIconDesc">{description}</desc> : ""}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5 16.5C11.1 16.5 10.8333 16.3714 10.5667 16.1143L3.9 9.68571C3.36667 9.17143 3.36667 8.4 3.9 7.88571C4.43333 7.37143 5.23333 7.37143 5.76667 7.88571L11.5 13.4143L17.2333 7.88571C17.7667 7.37143 18.5667 7.37143 19.1 7.88571C19.6333 8.4 19.6333 9.17143 19.1 9.68571L12.4333 16.1143C12.1667 16.3714 11.9 16.5 11.5 16.5V16.5Z"
        fill="#425462"
      />
    </svg>
  </div>
);

export default ChevronBottomIcon;
