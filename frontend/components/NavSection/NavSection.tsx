import React, { useState } from "react";

import styled from "styled-components";

const Section = styled.section`
  padding-top: 20px;
  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
  }
  button {
    border: none;
    background: inherit;
  }
  ${({ theme }) => `
    h4 {
      color: ${theme.colorNhsukBlue};
    }`}
`;

const NavSection = ({
  title,
  children,
  initiallyOpen = true,
}: {
  title: string;
  children: any;
  initiallyOpen?: boolean;
}) => {
  const [open, setOpen] = useState(initiallyOpen);

  const openChevron = require("../../public/chevronOpen.svg");
  const closedChevron = require("../../public/chevronClosed.svg");
  return (
    <Section>
      <div>
        <h4>{title}</h4>
        <button onClick={() => setOpen(!open)}>
          {open ? (
            <img src={openChevron} alt={`Collapse ${title}`} />
          ) : (
            <img src={closedChevron} alt={`Expand ${title}`} />
          )}
        </button>
      </div>
      {open && children}
    </Section>
  );
};

export default NavSection;
