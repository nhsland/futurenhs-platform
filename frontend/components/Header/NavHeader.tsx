import React from "react";

import { Header } from "nhsuk-react-components";
import styled from "styled-components";

const StyledHeader = styled(Header)`
  ${({ theme }) => `
    background-color: ${theme.colorNhsukWhite};
  `}
`;

const StyledHeaderContainer = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colorNhsukBlue};
    padding: 20px;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      right: 0;
    }

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

const StyledImg = styled.img`
  display: block;
  height: 40px;
  ${({ theme }) => `
    @media (max-width: ${theme.mqBreakpoints.tablet}) {
        height: 32px;
      }

    @media (max-width: ${theme.mqBreakpoints.mobile}) {
        height: 28px;
      }
  `}
`;

const StyledIcon = styled.img`
  max-height: 20px;
  max-width: 20px;
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
`;

const NavHeader = () => {
  return (
    <StyledHeader>
      <StyledHeaderContainer>
        <StyledImg
          src={require("../../public/FutureNHS.svg")}
          alt="FutureNHS logo"
        />
        <StyledHeaderLogo href="#" />
        <Header.MenuToggle />
      </StyledHeaderContainer>
      <StyledHeaderNav>
        <StyledHeaderNavItem href="#">
          <StyledIcon
            src={require("../../public/icons/workspaces.svg")}
            alt=""
          />
          My workspaces
        </StyledHeaderNavItem>
        <Header.NavItem href="#">My dashboard</Header.NavItem>
        <Header.NavItem href="#">Notifications</Header.NavItem>
        <Header.NavItem href="#">View profile</Header.NavItem>
        <Header.NavItem href="#">Help</Header.NavItem>
        <Header.NavItem href="#">Log out</Header.NavItem>
      </StyledHeaderNav>
    </StyledHeader>
  );
};

export default NavHeader;
