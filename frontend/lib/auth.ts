import { GetServerSidePropsContext } from "next";
import { redirect } from "./redirect";

export const requireAuthentication = (context: GetServerSidePropsContext) => {
  // @ts-ignore
  if (!context.req.user) {
    return redirect(context, `/auth/login?next=${context.req.url}`);
  }
};
