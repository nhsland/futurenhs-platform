import React from "react";

import Link from "next/link";
import { Header } from "nhsuk-react-components";
import styled from "styled-components";
import { v4 as uuid } from "uuid";

import { FnhsLogo } from "../Svg";

const StyledHeader = styled(Header)`
  ${({ theme }) => `
    background-color: ${theme.colorNhsukWhite};
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

const StyledIcon = styled.img`
  max-height: 24px;
  max-width: 24px;
  margin-right: 18px;
`;

const StyledSvgIcon = styled.svg.attrs({
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  xmlnsXlink: "http://www.w3.org/1999/xlink",
})`
  height: 20px;
  width: 20px;
  margin-right: 18px;
  ${({ theme }) => `
    color: ${theme.colorNhsukBlue};

    @media (min-width: ${theme.mqBreakpoints.largeDesktop}) {
      color: ${theme.colorNhsukWhite};
      margin-right: 10px;
    }
  `}
`;

const StyledHeaderNav = styled(Header.Nav)`
  ${({ theme }) => `
      @media (min-width: ${theme.mqBreakpoints.tablet}) {
        max-width: none;
      }
  `}
`;

const StyledHeaderNavItem = styled(Header.NavItem)`
  a {
    display: flex;
    align-items: center;
  }

  p {
    padding: 0 18px;
  }

  ${({ theme }) => `
    :hover svg,
    :hover .nhsuk-icon__chevron-right {
      // color: ${theme.colorNhsukWhite};
      color: currentColor;
      fill: ${theme.colorNhsukWhite};
    }
    :active svg,
    :active .nhsuk-icon__chevron-right {
      // color: ${theme.colorNhsukBlack};
      color: currentColor;
      fill: ${theme.colorNhsukBlack};
    }
  `}
`;

const items = [
  {
    title: "My workspaces",
    icon: require("../../public/workspace-blue.svg"),
    link: "/workspaces/directory",
  },
  {
    title: "My dashboard",
    icon: require("../../public/my-dashboard-blue.svg"),
    link: "#",
  },
  {
    title: "Notifications",
    icon: require("../../public/icons/notifications.svg"),
    link: "#",
  },
  {
    title: "View profile",
    icon: require("../../public/icons/profile.svg"),
    link: "#",
  },
  {
    title: "Help",
    icon: require("../../public/help-blue.svg"),
    link: "#",
  },
  {
    title: "Log out",
    icon: require("../../public/log-out-blue.svg"),
    link: "#",
  },
];

interface Props {
  title: string;
  icon: string;
  link: string;
}

const NavListItem = ({ title, icon, link }: Props) => {
  return (
    <Link href={link} passHref>
      <StyledNavListItem>
        <a>
          <StyledIcon src={icon} alt="" />
          <div>{title}</div>
        </a>
      </StyledNavListItem>
    </Link>
  );
};

const StyledNavListItem = styled.li`
  a {
    display: flex;
    justify-content: row;
    align-items: center;
    padding: 12px 16px;
  }
  div {
    font-size: 16px;
  }
`;

const NavHeader = () => {
  return (
    <StyledHeader>
      <StyledHeaderContainer>
        <FnhsLogo />
        <StyledHeaderLogo href="https://www.nhs.uk" />
        <Header.MenuToggle />
      </StyledHeaderContainer>
      <StyledHeaderNav>
        {items.map((item) => {
          return (
            <NavListItem
              title={item.title}
              icon={item.icon}
              link={item.link}
              key={uuid()}
            />
          );
        })}
      </StyledHeaderNav>
    </StyledHeader>
  );
};

export default NavHeader;
