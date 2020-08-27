import { ApolloServer } from "apollo-server-micro";
import { ApolloGateway } from "@apollo/gateway";

const gateway = new ApolloGateway({
  serviceList: [
    { name: "workspace-service", url: "http://localhost:3030/graphql" },
  ],
});

const server = new ApolloServer({ gateway, subscriptions: false });

export const config = {
  api: {
    bodyParser: false,
    cors: false,
  },
};

export default server.createHandler({ path: "/api/graphql" });
