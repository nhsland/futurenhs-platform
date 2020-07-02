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
  instrumentationKey: process.env.INSTRUMENTATION_KEY,
  isEnabled: process.env.NODE_ENV === 'production'

})(MyApp)
