import React from "react";

import { GetServerSideProps } from "next";
import Link from "next/link";

import { Header } from "../../components/Header";
import { MainHeading } from "../../components/MainHeading";
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
      <Header />
      <MainHeading>Pharmacy Page</MainHeading>
      <p>This is a different private page</p>
      <Link href="/workspaces/private">
        <a>Private workspace</a>
      </Link>
    </>
  );
};

export default PrivatePage;
