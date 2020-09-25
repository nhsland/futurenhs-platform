import React, { ReactChild } from "react";

import Link from "next/link";
import { Header } from "nhsuk-react-components";
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
  ${({ theme }) => `
    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      max-width: 280px;
    }
  `}

  padding: 0 16px;
  width: 100%;
  position: absolute;
  right: 0;
  background-color: white;
  border-left: 1px solid #f0f4f5;
  border-bottom: 1px solid #f0f4f5;

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
  }
`;

const StyledHeaderNavItem = styled(Header.NavItem)`
  list-style: none;
  border-top: 1px solid #f0f4f5;

  a {
    display: flex;
    align-items: center;
  }

  .nav-bar-item {
    display: none;
  }

  ${({ theme }) => `
    :hover a {
      color: ${theme.colorNhsukWhite};
    }
    :active a {
      color: ${theme.colorNhsukBlack};
    }
    :hover .nhsuk-icon__chevron-right {
      fill: ${theme.colorNhsukWhite};
    }
    :active .nhsuk-icon__chevron-right {
      fill: ${theme.colorNhsukBlack};
    }
  `}
`;

const StyledNavTitle = styled.div`
  padding-left: 20px;
`;

const StyledNavContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  border: 1px solid red;

  li {
    display: none;
    border-top: none;
  }

  ${({ theme }) => `
    background-color: ${theme.colorNhsukBlue};

    a {
      color: white;
    }

    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      border-top: none;
      justify-content: space-between;

      li {
        display: block;
      }
    }
  `}
`;

const StyledNavMenuButton = styled.button`
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

    :hover {
      background-color: #003d78;
      border-color: #f0f4f5;
      box-shadow: none;
    }
    :active {
      color: ${theme.colorNhsukBlack};
      background-color: ${theme.colorNhsukYellow};
      border-color: ${theme.colorNhsukYellow};
    }
  `}
`;

interface NavListItemProps {
  title: string;
  icon: ReactChild;
  link: string;
}

const NavListItem = ({ title, icon, link }: NavListItemProps) => {
  return (
    <Link href={link} passHref>
      <StyledHeaderNavItem>
        <a>
          {icon}
          <StyledNavTitle>{title}</StyledNavTitle>
        </a>
      </StyledHeaderNavItem>
    </Link>
  );
};

const NavMenu = () => {
  return (
    <StyledNavContainer>
      <NavListItem
        title="My workspaces"
        icon={<WorkspacesIcon />}
        link="/workspaces/directory"
      />
      <StyledNavMenuButton>Menu</StyledNavMenuButton>
    </StyledNavContainer>
  );
};

const navItems = [
  {
    title: "My workspaces",
    icon: <WorkspacesIcon />,
    link: "/workspaces/directory",
  },
  {
    title: "My dashboard",
    icon: <DashboardIcon />,
    link: "#",
  },
  {
    title: "Notifications",
    icon: <NotificationsIcon />,
    link: "#",
  },
  {
    title: "View profile",
    icon: <UserIcon />,
    link: "#",
  },
  {
    title: "Help",
    icon: <HelpIcon />,
    link: "#",
  },
  {
    title: "Log out",
    icon: <LogOutIcon />,
    link: "#",
  },
];

const NavList = () => {
  return (
    <StyledNav>
      <p>
        <span>Menu</span>
        <button className="nhsuk-header__navigation-title"></button>
      </p>
      {navItems.map((item) => {
        return (
          <NavListItem
            title={item.title}
            icon={item.icon}
            link={item.link}
            key={uuid()}
          />
        );
      })}
    </StyledNav>
  );
};

const NavHeader = () => {
  return (
    <StyledHeader>
      <StyledHeaderContainer>
        <FnhsLogo />
        <StyledHeaderLogo href="https://www.nhs.uk" />
        <Header.MenuToggle />
      </StyledHeaderContainer>
      <Header.Nav>
        {navItems.map((item) => {
          return (
            <NavListItem
              title={item.title}
              icon={item.icon}
              link={item.link}
              key={uuid()}
            />
          );
        })}
      </Header.Nav>
      <NavMenu /> {/* EXPERIMENTAL TINGS */}
      <NavList /> {/* EXPERIMENTAL TINGS */}
    </StyledHeader>
  );
};

export default NavHeader;
