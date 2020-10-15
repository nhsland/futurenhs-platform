import React, { useState } from "react";

import styled from "styled-components";

import { NavList, NavMenuListItem, NavMenuButton } from ".";
import {
  WorkspacesIcon,
  FnhsLogoIcon,
  DashboardIcon,
  HelpIcon,
  LogOutIcon,
  NhsukLogoIcon,
  NotificationsIcon,
  UserIcon,
} from "../Icon";

const StyledHeader = styled.header`
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

const StyledFnhsLogo = styled(FnhsLogoIcon)`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 40px;
    width: auto;
  }

  ${({ theme }) => `
    color: ${theme.colorNhsukWhite};
    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      color: ${theme.colorNhsukBlue};
    }
    svg {
      @media (max-width: ${theme.mqBreakpoints.tablet}) {
        height: 32px;
      }
      @media (max-width: ${theme.mqBreakpoints.mobile}) {
        height: 28px;
      }
    }
  `}
`;

const StyledHeaderLogo = styled(NhsukLogoIcon)`
  display: none;
  border: 4px solid transparent;

  ${({ theme }) => `
    :hover:not(:active) {
      border: 4px solid ${theme.colorShadeNhsukBlue35};
    }
    :active {
      background-color: white;
      border: 4px solid ${theme.colorNhsukYellow};
    }
    :focus {
      background-color: white;
      border: 4px solid ${theme.colorNhsukYellow};
    }
    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      display: flex;
    }
  `}
`;

const StyledNavContainer = styled.div`
  align-items: center;
  padding: 0px 20px;
  display: none;

  ${({ theme }) => `
    background-color: ${theme.colorNhsukBlue};

    .nav-bar-item {
      display: none;
      border-top: none;

      a {
        color: ${theme.colorNhsukWhite};
        &:focus {
          color: ${theme.colorNhsukBlack};
        }
      }

      .nhsuk-icon {
        display: none;
      }
    }

    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      border-top: none;
      justify-content: space-between;
      display: flex;

      .nav-bar-item {
        display: flex;
      }
    }
  `}
`;

const navItems = [
  {
    // This item will be hidden on desktop
    title: "My workspaces",
    icon: <WorkspacesIcon />,
    href: "/workspaces/directory",
    className: "mobileOnly",
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
    href: "/auth/logout",
  },
];

interface NavHeaderProps {
  initiallyOpen?: boolean;
}

const NavHeader = ({ initiallyOpen = false }: NavHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(initiallyOpen);
  return (
    <StyledHeader>
      <StyledHeaderContainer>
        <StyledFnhsLogo className="fnhs-logo" />
        <StyledHeaderLogo />
        <NavMenuButton
          className="mobile-nav-menu"
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </StyledHeaderContainer>
      <StyledNavContainer>
        <NavMenuListItem
          className="nav-bar-item"
          title="My workspaces"
          icon={<WorkspacesIcon />}
          href="/workspaces/directory"
        />
        <NavMenuButton
          className="desktop-nav-menu"
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </StyledNavContainer>
      {menuOpen && <NavList navItems={navItems} setMenuOpen={setMenuOpen} />}
    </StyledHeader>
  );
};

export default NavHeader;
