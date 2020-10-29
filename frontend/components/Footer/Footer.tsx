import React from "react";

import Link from "next/link";
import { Footer as NhsFooter } from "nhsuk-react-components";

interface Props {
  title: string;
  href: string;
}

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
      <NhsFooter.Copyright>
        &copy; All content is available under the Open Government Licence v3.0,
        except where otherwise stated.
      </NhsFooter.Copyright>
    </NhsFooter>
  );
};

export default Footer;
