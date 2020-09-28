import React, { ReactNode } from "react";

import Link from "next/link";
import { ChevronRightIcon } from "nhsuk-react-components";

interface NavItemProps {
  className?: string;
  href: string;
  children: ReactNode;
}

const NavListItem = ({ className, href, children }: NavItemProps) => {
  return (
    <Link href={href}>
      <li className={className}>
        <a href={href}>
          {children}
          <ChevronRightIcon />
        </a>
      </li>
    </Link>
  );
};

export default NavListItem;
