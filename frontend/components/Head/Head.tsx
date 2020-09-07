import React from "react";
import { default as NextHead } from "next/head";

interface Props {
  title: string;
}
const Head = ({ title }: Props) => (
  <NextHead>
    <title>{title}</title>
  </NextHead>
);

export default Head;
