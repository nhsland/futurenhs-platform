import React from "react";
import { GetServerSideProps } from "next";
import { requireAuthentication } from "../../lib/auth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = requireAuthentication(context);
  if (result) {
    return result;
  }

  return {
    props: {},
  };
};

const PrivatePage = () => {
  return (
    <>
      <div>Private Pharmacy Page</div>
      <div>This is a different private page</div>
    </>
  );
};

export default PrivatePage;
