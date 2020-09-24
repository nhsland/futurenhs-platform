import React from "react";

interface Props {
  className?: string;
}

const WorkspacesIcon = ({ className }: Props) => (
  <div className={`icon-wrapper workspaces-icon-wrapper ${className}`}>
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
        d="M2.24028 9.48647C2.01733 9.39277 2 9.1849 2 9.12343C2 9.06195 2.01733 8.85409 2.24028 8.76037L11.0455 5.05934C11.3494 4.93157 11.6706 4.86679 12 4.86679C12.3294 4.86679 12.6506 4.93157 12.9545 5.05934L21.7597 8.76037C21.9827 8.85409 22 9.06195 22 9.12343C22 9.1849 21.9827 9.39277 21.7597 9.48647L12.9545 13.1875C12.6506 13.3153 12.3294 13.3801 12 13.3801C11.6706 13.3801 11.3494 13.3153 11.0455 13.1875L2.24028 9.48647ZM21.7597 15.2471C21.9827 15.3408 22 15.5487 22 15.6102C22 15.6716 21.9827 15.8795 21.7597 15.9732L12.9545 19.6742C12.6506 19.802 12.3294 19.8668 12 19.8668C11.6706 19.8668 11.3494 19.802 11.0455 19.6742L2.24028 15.9732C2.01733 15.8795 2 15.6716 2 15.6102C2 15.5487 2.01733 15.3408 2.24028 15.2471L4.5921 14.2586L10.8546 16.8908C11.221 17.0449 11.6105 17.1219 12 17.1219C12.3895 17.1219 12.779 17.0449 13.1454 16.8908L19.4079 14.2586L21.7597 15.2471ZM21.7597 12.7298L12.9545 16.4309C12.6506 16.5586 12.3294 16.6234 12 16.6234C11.6706 16.6234 11.3494 16.5586 11.0455 16.4309L2.24028 12.7298C2.01733 12.6361 2 12.4283 2 12.3668C2 12.3053 2.01733 12.0975 2.24028 12.0037L4.5921 11.0152L10.8546 13.6475C11.221 13.8015 11.6105 13.8785 12 13.8785C12.3895 13.8785 12.779 13.8015 13.1454 13.6475L19.4079 11.0152L21.7597 12.0037C21.9827 12.0975 22 12.3053 22 12.3668C22 12.4283 21.9827 12.6361 21.7597 12.7298Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

export default WorkspacesIcon;
