import React from "react";
import { GetServerSideProps } from "next";
import { requireAuthentication } from "../../utils/pages/auth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  await requireAuthentication(context);

  return {
    props: {},
  };
};

const PrivatePage = () => {
  return (
    <>
      <div>Private Page</div>
      <div>This is my cookie</div>
    </>
  );
};

export default PrivatePage;
