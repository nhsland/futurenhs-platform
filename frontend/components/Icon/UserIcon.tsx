import React from "react";

interface Props {
  className?: string;
}

const UserIcon = ({ className }: Props) => (
  <div className={`icon-wrapper user-icon-wrapper ${className}`}>
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
        d="M12 3C17.5229 3 22 7.54167 22 13.1458C22 16.5542 20.3427 19.5698 17.801 21.4094C17.7406 20.8177 17.6031 20.2771 17.2958 19.7823C16.3719 18.299 14.7354 17.6083 12.1437 17.6083C9.525 17.6083 7.88229 18.2979 6.97187 19.7802C6.62083 20.351 6.48333 20.8292 6.43125 21.5708C3.75833 19.75 2 16.6562 2 13.1448C2 7.54167 6.47708 3 12 3ZM8.40004 13.0781C8.40004 15.0531 10.025 16.6615 12.0219 16.6615C14.0198 16.6615 15.6438 15.0531 15.6438 13.0781C15.6438 11.1 14.0188 9.49271 12.0219 9.49271C10.024 9.49271 8.40004 11.1 8.40004 13.0781Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default UserIcon;
