import React, { useState } from "react";

import { Header } from "nhsuk-react-components";
import styled from "styled-components";

import { NavList, NavMenuListItem, NavMenuButton } from ".";
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

const NavHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <StyledHeader>
      <StyledHeaderContainer>
        <FnhsLogo />
        <StyledHeaderLogo href="https://www.nhs.uk" />
        <NavMenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </StyledHeaderContainer>
      <StyledNavContainer>
        <NavMenuListItem
          title="My workspaces"
          icon={<WorkspacesIcon />}
          href="/workspaces/directory"
        />
        <NavMenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </StyledNavContainer>
      {menuOpen && <NavList navItems={navItems} setMenuOpen={setMenuOpen} />}
    </StyledHeader>
  );
};

export default NavHeader;
