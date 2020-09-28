import React, { ReactChild, useState, ReactNode } from "react";

import Link from "next/link";
import { Header, ChevronRightIcon } from "nhsuk-react-components";
import { Icons } from "nhsuk-react-components";
import styled from "styled-components";
import { v4 as uuid } from "uuid";

import {
  WorkspacesIcon,
  DashboardIcon,
  HelpIcon,
  LogOutIcon,
  NotificationsIcon,
  UserIcon,
} from "../Icon";
import { FnhsLogo } from "../Svg";

const StyledHeader = styled(Header)`
  ${({ theme }) => `
    background-color: ${theme.colorNhsukWhite};
    position: relative;
  `}
`;

const StyledHeaderContainer = styled.div`
  padding: 20px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    right: 0;
  }

  ${({ theme }) => `
    background-color: ${theme.colorNhsukBlue};

    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      background-color: ${theme.colorNhsukWhite};

      button {
        display: none;
      }

      .nhsuk-header__menu {
        position: absolute;
      }
    }
  `}
`;

const StyledHeaderLogo = styled(Header.Logo)`
  display: none;
  ${({ theme }) => `
    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      display: block;
    }
  `}
`;

const StyledNav = styled.div`
  width: 100%;
  right: 0;

  ${({ theme }) => `
    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      max-width: 280px;
      position: absolute;
    }
    background-color: ${theme.colorNhsukWhite};
    border-left: 1px solid ${theme.colorNhsukGrey5};
    border-bottom: 1px solid ${theme.colorNhsukGrey5};
  `}

  p {
    margin: 0;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: centre;

    ${({ theme }) => `
      @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
        display: none;
      }
    `}
  }

  span {
    font-weight: 700;
    align-self: center;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  li:first-child {
    ${({ theme }) => `
      @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
        display: none;
      }
    `}
  }
`;

interface NavItemProps {
  className?: string;
  href: string;
  children: ReactNode;
}

const NavItem = ({ className, href, children }: NavItemProps) => {
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

// const NavBarItem = ({ className, href, children }: NavItemProps) => {
//   return (
//     <Link href={href}>
//       <li className={className}>
//         <a href={href}>
//           {children}
//           <ChevronRightIcon />
//         </a>
//       </li>
//     </Link>
//   );
// };

// const StyledNavBarItem = styled(NavBarItem)

const StyledHeaderNavItem = styled(NavItem)`
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    border-bottom: 4px solid transparent;
    border-top: 4px solid transparent;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${({ theme }) => `
    border-top: 1px solid ${theme.colorNhsukGrey5};

    a {
      color: ${theme.colorNhsukBlue};
      text-decoration: none;

      &:hover:not(:active) {
        color: ${theme.colorNhsukWhite};
        background-color: ${theme.colorShadeNhsukBlue35};

        .nhsuk-icon__chevron-right {
          fill: ${theme.colorNhsukWhite};
        }
      }

      &:focus {
        box-shadow: none;
        outline: none;
        border-bottom: 4px solid ${theme.colorNhsukBlack};
      }
    }
  `}
`;

const StyledNavTitle = styled.div`
  padding-left: 20px;
  flex-grow: 1;
`;

const StyledNavContainer = styled.div`
  align-items: center;
  padding: 0px 20px;
  display: none;

  ${({ theme }) => `
    background-color: ${theme.colorNhsukBlue};

    li {
      display: none;
      border-top: none;
      fill: ${theme.colorNhsukWhite};

      .nhsuk-icon {
        display: none;
      }
    }

    a {
      padding: 12px 16px;
      color: white;
      border-bottom: 4px solid transparent;
      border-top: 4px solid transparent;
    }

    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      border-top: none;
      justify-content: space-between;
      display: flex;

      li {
        display: flex;
      }
    }
  `}
`;

interface MenuProps {
  className?: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const MenuButton = ({ className, menuOpen, setMenuOpen }: MenuProps) => {
  return (
    <button className={className} onClick={() => setMenuOpen(!menuOpen)}>
      Menu
    </button>
  );
};

const StyledNavMenuButton = styled(MenuButton)`
  ${({ theme }) => `
    color: ${theme.colorNhsukWhite};
    padding: 7px 16px;
    height: 100%;
    background-color: transparent;
    border: 1px solid ${theme.colorNhsukWhite};
    border-radius: 4px;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;

    :focus {
      outline: none;
    }

    :hover {
      background-color: ${theme.colorShadeNhsukBlue35};
      border-color: ${theme.colorNhsukGrey5};
      box-shadow: none;
    }

    :active, :focus {
      border: 1px solid ${theme.colorNhsukYellow};
      color: ${theme.colorNhsukBlack};
      background-color: ${theme.colorNhsukYellow};
      border-color: ${theme.colorNhsukYellow};
    }
  `}
`;

const StyledCloseIcon = styled(Icons.Close)`
  ${({ theme }) => `
    :hover {
      fill: ${theme.colorNhsukWhite};
      background-color: ${theme.colorShadeNhsukBlue35};
    }
    :active {
      fill: ${theme.colorNhsukBlack};
      background-color: ${theme.colorNhsukYellow};
      border-bottom: 4px solid ${theme.colorNhsukBlack};
    }
  `}
`;

interface NavListItemProps {
  title: string;
  icon: ReactChild;
  href: string;
}

const NavListItem = ({ title, icon, href }: NavListItemProps) => {
  return (
    <StyledHeaderNavItem href={href}>
      {icon}
      <StyledNavTitle>{title}</StyledNavTitle>
    </StyledHeaderNavItem>
  );
};

const navItems = [
  {
    title: "My workspaces",
    icon: <WorkspacesIcon />,
    href: "/workspaces/directory",
  },
  {
    title: "My dashboard",
    icon: <DashboardIcon />,
    href: "#",
  },
  {
    title: "Notifications",
    icon: <NotificationsIcon />,
    href: "#",
  },
  {
    title: "View profile",
    icon: <UserIcon />,
    href: "#",
  },
  {
    title: "Help",
    icon: <HelpIcon />,
    href: "#",
  },
  {
    title: "Log out",
    icon: <LogOutIcon />,
    href: "#",
  },
];

interface NavListProps {
  setMenuOpen: (open: boolean) => void;
}

const NavList = ({ setMenuOpen }: NavListProps) => {
  return (
    <StyledNav>
      <p>
        <span>Menu</span>
        <StyledCloseIcon onClick={() => setMenuOpen(false)} />
      </p>
      <ul>
        {navItems.map((item) => {
          return (
            <NavListItem
              title={item.title}
              icon={item.icon}
              href={item.href}
              key={uuid()}
            />
          );
        })}
      </ul>
    </StyledNav>
  );
};

const NavHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <StyledHeader>
      <StyledHeaderContainer>
        <FnhsLogo />
        <StyledHeaderLogo href="https://www.nhs.uk" />
        <StyledNavMenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </StyledHeaderContainer>
      <StyledNavContainer>
        <NavListItem
          title="My workspaces"
          icon={<WorkspacesIcon />}
          href="/workspaces/directory"
        />
        <StyledNavMenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </StyledNavContainer>
      {menuOpen && <NavList setMenuOpen={setMenuOpen} />}
    </StyledHeader>
  );
};

export default NavHeader;
