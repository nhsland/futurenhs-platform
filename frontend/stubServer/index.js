const fs = require("fs");
const path = require("path");

const bodyParser = require("body-parser");
const app = require("express")();
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const root = require("./resolver");

const port = 3001;

const stubServer = () => {
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));

  const schemaCode = fs.readFileSync(
    path.join(__dirname, "schema", "../../schema.graphql"),
    "utf8"
  );
  const schema = buildSchema(schemaCode);

  app.use("/graphql", (req, res) => {
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
      context: { schemaCode },
    })(req, res);
  });

  app.listen(port);
};

(() => {
  stubServer();
})();
