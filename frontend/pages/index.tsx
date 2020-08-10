import React from "react";
import Head from "next/head";
import Layout from "../components/layout";
import hypeStyles from "../styles/hype.module.css";

const Home = () => {
  return (
    <Layout>
      <Head>
        <title>FutureNHS</title>
      </Head>
      <div className={hypeStyles.page}>
        <section className={hypeStyles.futureIsComing}>
          <img
            src="/hype/logo.png"
            srcSet="/hype/logo@2x.png 2x, /hype/logo@3x.png 3x"
            alt="FutureNHS"
          />
          <p>The new Future is coming...</p>
        </section>
        <img
          src="/hype/marty.jpg"
          srcSet="/hype/marty@2x.jpg 2x, /hype/marty@3x.jpg 3x"
          alt=""
          className={hypeStyles.marty}
        />
      </div>
    </Layout>
  );
};

export default Home;
