import React from "react";

interface Props {
  className?: string;
}

const HelpIcon = ({ className }: Props) => (
  <div className={`icon-wrapper help-icon-wrapper ${className || ""}`}>
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7534 2C7.23057 2 2.75342 6.47715 2.75342 12C2.75342 17.5228 7.23057 22 12.7534 22C18.2763 22 22.7534 17.5228 22.7534 12C22.7534 9.34784 21.6999 6.8043 19.8245 4.92893C17.9491 3.05357 15.4056 2 12.7534 2ZM13.2834 17.362C13.0937 17.5222 12.8237 17.5454 12.6094 17.42C12.3808 17.3027 12.2497 17.055 12.2814 16.8C12.2814 16.304 12.6154 16 13.0414 16.096C13.2724 16.1339 13.4544 16.3135 13.4954 16.544C13.5534 16.842 13.5534 17.146 13.2834 17.362ZM15.0834 11.962C14.7634 12.222 14.4154 12.45 14.0694 12.678C13.7167 12.8749 13.517 13.2647 13.5634 13.666C13.5745 13.767 13.5745 13.869 13.5634 13.97C13.5308 14.2888 13.2534 14.5257 12.9334 14.508C12.6208 14.5013 12.3628 14.2613 12.3334 13.95C12.2434 13.008 12.5234 12.228 13.3334 11.684C13.6394 11.484 13.9334 11.262 14.2534 11.06C15.2534 10.412 15.2534 8.634 14.0094 8.034C13.1982 7.61724 12.2348 7.62172 11.4274 8.046C11.0019 8.26392 10.6695 8.6283 10.4914 9.072C10.4155 9.29344 10.2211 9.453 9.98907 9.48416C9.75707 9.51533 9.52738 9.41274 9.39575 9.21918C9.26413 9.02561 9.25316 8.7743 9.36742 8.57C9.91342 7.448 10.8454 6.83 12.0394 6.57C12.2546 6.53364 12.4716 6.50893 12.6894 6.496C13.9094 6.542 14.8714 6.996 15.5914 7.896C16.5914 9.16 16.3674 10.926 15.0874 11.968L15.0834 11.962Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default HelpIcon;
