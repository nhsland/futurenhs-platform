import React, { useState } from "react";

import styled from "styled-components";

import { ChevronBottomIcon, ChevronTopIcon } from "../Icon";

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
  .chevron {
    outline: inherit;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    cursor: pointer;
    :focus {
      background-color: ${({ theme }) => theme.colorNhsukYellow};
      border-bottom: 4px solid ${({ theme }) => theme.colorNhsukBlack};
    }
  }
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

  return (
    <Section>
      <div>
        <h4>{title}</h4>
        <button className="chevron" onClick={() => setOpen(!open)}>
          {open ? (
            <ChevronTopIcon title={`Hide ${title}`} />
          ) : (
            <ChevronBottomIcon title={`Show ${title}`} />
          )}
        </button>
      </div>
      {open && children}
    </Section>
  );
};

export default NavSection;
