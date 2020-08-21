import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext } from "next";

/// Inspired by the api of the `next-redirect` package, but I couldn't find any typings
/// for that, so I made one myself.
export const redirect = (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  path: string
): { props: any } => {
  context.res.writeHead(302, {
    Location: path,
  });
  context.res.end();
  // props are unused if we redirect, but we have to return something to keep the type checker happy.
  return { props: {} };
};
