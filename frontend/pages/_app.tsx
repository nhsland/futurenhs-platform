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
  instrumentationKey: "18be3b83-4ad5-4186-a7b6-f65dd1253a77",
  isEnabled: process.env.NODE_ENV === 'production'
})(MyApp)
