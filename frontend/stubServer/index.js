const fs = require("fs");
const path = require("path");

const { ApolloServer, gql } = require("apollo-server-express");
const bodyParser = require("body-parser");
const app = require("express")();

const resolvers = require("./resolver");

const port = 3001;
const schemaCode = fs.readFileSync(
  path.join(__dirname, "schema", "../../schema.graphql"),
  "utf8"
);
const typeDefs = gql`
  ${schemaCode}
`;

const stubServer = () => {
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  server.applyMiddleware({ app });
  app.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${port}`);
  });
};

(() => {
  stubServer();
})();
