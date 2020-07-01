import React from "react";
import App from "next/app";
import { withApplicationInsights } from 'next-applicationinsights';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (

      <Component {...pageProps} />
    )
  }
}

export default withApplicationInsights({
  instrumentationKey: "a2fa06cc-a1de-4efd-9096-9f99aa23a01c",
  isEnabled: true //process.env.NODE_ENV === 'production'
})(MyApp)
