const fs = require("fs");
const path = require("path");

const { ApolloServer, gql } = require("apollo-server-express");
const app = require("express")();
const { buildClientSchema, printSchema } = require("graphql/utilities");

const createResolvers = require("./resolver");

const port = 3001;
const introspectionSchema = fs.readFileSync(
  path.join(__dirname, "../../workspace-service/graphql-schema.json"),
  "utf8"
);
const schema = printSchema(buildClientSchema(JSON.parse(introspectionSchema)));

const stubServer = () => {
  const server = new ApolloServer({
    typeDefs: gql(schema),
    resolvers: createResolvers(schema),
  });
  server.applyMiddleware({ app });
  app.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
};

stubServer();
