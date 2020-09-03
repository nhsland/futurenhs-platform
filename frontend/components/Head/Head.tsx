import React from "react";
import Head from "next/head";

interface Props {
  title: string;
}
const PageHead = ({ title }: Props) => (
  <Head>
    <title>{title}</title>
  </Head>
);

export default PageHead;
