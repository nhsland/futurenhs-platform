import React from "react";

import { render as defaultRender, RenderResult } from "@testing-library/react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { NextRouter } from "next/router";
import { ThemeProvider } from "styled-components";

import theme from "../../lib/fixtures/theme.json";

export * from "@testing-library/react";

// --------------------------------------------------
// Override the default test render with our own, which includes a router and
// theme mock.
//
// You can override the router mock like this:
//
// const { baseElement } = render(<MyComponent />, {
//   router: { pathname: '/my-custom-pathname' },
// });
// --------------------------------------------------
type DefaultParams = Parameters<typeof defaultRender>;
type RenderUI = DefaultParams[0];
type RenderOptions = DefaultParams[1] & { router?: Partial<NextRouter> };

export function render(
  ui: RenderUI,
  { wrapper, router, ...options }: RenderOptions = {}
): RenderResult {
  if (!wrapper) {
    const Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <RouterContext.Provider value={{ ...mockRouter, ...router }}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </RouterContext.Provider>
    );
    Wrapper.displayName = "Wrapper";
    wrapper = Wrapper;
  }

  return defaultRender(ui, { wrapper, ...options });
}

const mockRouter: NextRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
};
