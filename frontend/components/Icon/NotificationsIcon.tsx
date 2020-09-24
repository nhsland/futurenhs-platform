import React from "react";

interface Props {
  className?: string;
}

const NotificationsIcon = ({ className }: Props) => (
  <div className={`icon-wrapper notifications-icon-wrapper ${className}`}>
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
        d="M12.5647 2.00037C11.7077 2.01705 11.017 2.696 11 3.53846L14.0905 3.50028C14.0997 3.09978 13.9419 2.713 13.6537 2.42973C13.3656 2.14646 12.9721 1.99134 12.5647 2.00037ZM18.4961 9.51687C18.4961 9.51687 18.0573 12.985 18.8757 15.4895C19.3224 16.8601 21 18.9231 21 18.9231H4C4 18.9231 5.6776 16.8601 6.12434 15.4895C6.94271 12.985 6.50388 9.64485 6.50388 9.64485V9.27884C6.55247 6.09485 9.22422 3.53846 12.5033 3.53846C15.7824 3.53846 18.4541 6.09485 18.5027 9.27884L18.4961 9.51687ZM14.8182 19.6923C14.8182 20.9668 13.6073 22 12.1136 22C10.62 22 9.40909 20.9668 9.40909 19.6923H14.8182Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default NotificationsIcon;
