const gql = require("graphql-tag");
const { createClient } = require("urql");

const client = createClient({
  url: "http://localhost:3030/graphql",
});

const getOrCreateUser = async ({ authId, name }) => {
  try {
    const reqBody = gql`
      mutation($authId: ID!, $name: String!) {
        getOrCreateUser(newUser: { authId: $authId, name: $name }) {
          id
          name
          authId
          isPlatformAdmin
        }
      }
    `;

    return await client
      .mutation(reqBody, { authId, name })
      .toPromise()
      .then((result) => {
        if (result.error) {
          throw result.error;
        } else {
          return result.data;
        }
      });
  } catch (err) {
    console.log("getOrCreateUser Error: ", err);
  }
};

module.exports = {
  getOrCreateUser,
};
