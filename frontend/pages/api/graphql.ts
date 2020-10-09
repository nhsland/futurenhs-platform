import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { ApolloServer } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";

import { User } from "../../lib/auth";
import { requireEnv } from "../../lib/requireEnv";

const workspaceAPIServerUrl = requireEnv("WORKSPACE_SERVICE_GRAPHQL_ENDPOINT");

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: "workspace-service",
      url: workspaceAPIServerUrl,
    },
  ],
  buildService: ({ url }) =>
    new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        // context will be empty for schema requests
        console.log("xxx", context);
        const userId = context.user?.id;
        if (userId) {
          request.http?.headers.set("x-user-id", userId);
        }
      },
    }),
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
  context: ({ req }) => ({ user: req.user }),
});

export const config = {
  api: {
    bodyParser: false,
    cors: false,
  },
};

const handler = server.createHandler({ path: "/api/graphql" });
interface NextApiRequestWithUser extends NextApiRequest {
  user?: User;
}
export default (req: NextApiRequestWithUser, res: NextApiResponse) =>
  req.user ? handler(req, res) : res.status(401).end();
