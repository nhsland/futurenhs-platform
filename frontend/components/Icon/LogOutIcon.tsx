import React from "react";

interface Props {
  className?: string;
}

const LogOutIcon = ({ className }: Props) => (
  <div className={`icon-wrapper logout-icon-wrapper ${className}`}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4118 3.17647L13.7647 5.52941H4.35294V19.6471H18.4706V10.2353L20.8235 12.5882V22H2V3.17647H11.4118ZM22 2V9.05882L19.6471 6.70588V5.92118L10.2353 14.9412L8.57176 13.2776L17.8824 4.35294H17.2941L14.9412 2H22Z"
        fill="#currentColor"
      />
    </svg>
  </div>
);

export default LogOutIcon;
