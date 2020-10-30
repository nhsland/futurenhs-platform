import React from "react";

import Link from "next/link";
import { Footer as NhsFooter } from "nhsuk-react-components";
import styled from "styled-components";

import { BetaIcon, OGLIcon } from "../Icon";

interface Props {
  title: string;
  href: string;
}

const Container = styled.div`
  clear: both;
  padding-top: 16px;
`;

const TextContainer = styled.div`
  padding-top: 16px;
  margin-bottom: 0;
  font-size: 14px;
  ${({ theme }) => `
    color: ${theme.colorNhsukGrey1};
    @media (min-width: ${theme.mqBreakpoints.tablet}) {
      font-size: 16px;
    }
  `}
`;

const StyledBetaIcon = styled(BetaIcon)`
  display: inline-block;
  position: relative;
  top: 5px;
  margin-right: 8px;
  ${({ theme }) => `
    color: ${theme.colorNhsukGrey1};
  `}
`;

const StyledOGLIcon = styled(OGLIcon)`
  display: inline-block;
  position: relative;
  top: 2px;
  left: 4px;
  margin-right: 8px;
  width: 50px;
  ${({ theme }) => `
    color: ${theme.colorNhsukGrey1};
  `}
`;

export const FooterListItem: React.FC<Props> = ({ title, href }) => (
  <li className="nhsuk-footer__list-item">
    <Link href={href} passHref>
      <a className="nhsuk-footer__list-item-link">{title}</a>
    </Link>
  </li>
);

const Footer = () => {
  return (
    <NhsFooter>
      <NhsFooter.List>
        <FooterListItem title="About" href="#" />
        <FooterListItem title="Terms and Conditions" href="#" />
        <FooterListItem title="Accessibility Statement" href="#" />
        <FooterListItem title="Privacy Policy" href="#" />
      </NhsFooter.List>
      <NhsFooter.Copyright>&copy; Crown copyright</NhsFooter.Copyright>
      <Container>
        <TextContainer>
          <StyledBetaIcon />
          This is a new platform. Your feedback will help us to improve it.
        </TextContainer>
        <TextContainer>
          <StyledOGLIcon />
          All content is available under the{" "}
          <a
            className="nhsuk-footer__list-item-link"
            data-cy="license"
            href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
          >
            Open Government Licence v3.0
          </a>
          , except where otherwise stated.
        </TextContainer>
      </Container>
    </NhsFooter>
  );
};

export default Footer;
