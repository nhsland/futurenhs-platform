import React, { useState } from "react";

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

  ${({ theme }) => `
    :hover .nhsuk-icon__chevron-right {
      fill: ${theme.colorNhsukWhite};
    }
    :active .nhsuk-icon__chevron-right {
      fill: ${theme.colorNhsukBlack};
    }
  `}
`;

const items = [
  {
    title: "My workspaces",
    icon: require("../../public/workspace-blue.svg"),
    iconHover: require("../../public/workspace-white.svg"),
    link: "/workspaces/directory",
  },
  {
    title: "My dashboard",
    icon: require("../../public/my-dashboard-blue.svg"),
    iconHover: require("../../public/my-dashboard-white.svg"),
    link: "#",
  },
  {
    title: "Notifications",
    icon: require("../../public/notifications-blue.svg"),
    iconHover: require("../../public/notifications-white.svg"),
    link: "#",
  },
  {
    title: "View profile",
    icon: require("../../public/user-blue.svg"),
    iconHover: require("../../public/user-white.svg"),
    link: "#",
  },
  {
    title: "Help",
    icon: require("../../public/help-blue.svg"),
    iconHover: require("../../public/help-white.svg"),
    link: "#",
  },
  {
    title: "Log out",
    icon: require("../../public/log-out-blue.svg"),
    iconHover: require("../../public/log-out-white.svg"),
    link: "#",
  },
];

interface Props {
  title: string;
  icon: string;
  iconHover: string;
  link: string;
}

// function setHover(e) {
//   e.target.style.background = "red";
// }

const NavListItem = ({ title, icon, iconHover, link }: Props) => {
  const [hover, setHover] = useState(false);
  const toggle = () => setHover(!hover);
  console.log("the icon is ....", icon);
  console.log("the iconHover is ....", iconHover);

  return (
    <Link href={link} passHref>
      <StyledHeaderNavItem onMouseOver={toggle} onMouseOut={toggle}>
        <a>
          <StyledIcon src={hover ? iconHover : icon} alt="" />
          <div>{title}</div>
        </a>
      </StyledHeaderNavItem>
    </Link>
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
      <StyledHeaderNav>
        {items.map((item) => {
          return (
            <NavListItem
              title={item.title}
              icon={item.icon}
              iconHover={item.iconHover}
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
