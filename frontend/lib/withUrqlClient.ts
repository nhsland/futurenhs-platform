import { NextPage } from "next";
import { withUrqlClient as withUrqlClientImpl } from "next-urql";
import NextApp from "next/app";

import { User } from "./auth";

const isServerSide = typeof window === "undefined";

export default function withUrqlClient(
  component: NextPage<any> | typeof NextApp
) {
  return withUrqlClientImpl(
    (_ssrExchange, ctx) => {
      if (ctx && ctx.req && ctx.res) {
        // @ts-ignore
        const user: User = ctx.req.user;
        if (!user) {
          ctx.res.writeHead(302, {
            Location: `/auth/login?next=${ctx.req.url}`,
          });
          ctx.res.end();
        }
      }
      return {
        url: isServerSide
          ? "http://workspace-service.workspace-service/graphql"
          : "/api/graphql",
      };
    },
    { ssr: true }
  )(component);
}
