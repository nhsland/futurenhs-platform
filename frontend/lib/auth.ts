import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

import { redirect } from "./redirect";

export interface User {
  id: string;
  name: string;
  emails: string[];
}

export const requireAuthentication = <P>(
  getServerSideProps: (
    context: GetServerSidePropsContext,
    user: User
  ) => Promise<GetServerSidePropsResult<P>>
): GetServerSideProps<P> => async (context) => {
  // @ts-ignore
  const user: User = context.req.user;

  if (!user) {
    return redirect(context, `/auth/login?next=${context.req.url}`);
  }

  return getServerSideProps(context, user);
};
