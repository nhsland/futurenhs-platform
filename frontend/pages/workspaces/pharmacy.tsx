import React from "react";

import { GetServerSideProps } from "next";
import Link from "next/link";

import { MainHeading } from "../../components/MainHeading";
import { NavHeader } from "../../components/NavHeader";
import { requireAuthentication } from "../../lib/auth";

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async () => {
    return {
      props: {},
    };
  }
);

const PrivatePage = () => {
  return (
    <>
      <NavHeader />
      <MainHeading>Pharmacy Page</MainHeading>
      <p>This is a different private page</p>
      <Link href="/workspaces/private">
        <a>Private workspace</a>
      </Link>
    </>
  );
};

export default PrivatePage;
