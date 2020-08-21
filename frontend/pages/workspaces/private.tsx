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
      <div>Private Page</div>
    </>
  );
};

export default PrivatePage;
