import React from "react";

import Head from "next/head";
import Link from "next/link";

import Layout from "../components/layout";

const Dev = () => {
  // this is purely here to check that we receive client side exceptions within Application Insights
  const outrage = () => {
    throw new Error("No, eggs are not suitable for Vegans");
  };
  return (
    <Layout>
      <Head>
        <title>FutureNHS Dev Page</title>
      </Head>
      <section>
        <h2>Useful links</h2>
        <ul>
          <li>
            <Link href="/auth/login">
              <a>Login</a>
            </Link>
          </li>
          <li>
            <Link href="/auth/resetpassword">
              <a>Reset password</a>
            </Link>
          </li>
          <li>
            <Link href="/auth/logout">
              <a>Logout</a>
            </Link>
          </li>
        </ul>
      </section>
      <section>
        <h2>Actions</h2>
        <button onClick={outrage}>
          Are eggs suitable for vegans? Click button to find out
        </button>
      </section>
    </Layout>
  );
};

export default Dev;
