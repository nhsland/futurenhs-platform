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
        d="M9.39824 18L9.81754 17.5938L6 13.8955L14.5895 5.57445C15.3801 4.80852 16.662 4.80852 17.4526 5.57445L18.407 6.49902C19.1977 7.26495 19.1977 8.50678 18.407 9.27271L9.39824 18ZM9 18.5507C8.66001 18.8397 8.22704 19 7.77754 19H5.31461C5.14086 19 5 18.8591 5 18.6854V16.2225C5 15.773 5.16032 15.34 5.4493 15L9 18.5507Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default Icon;
