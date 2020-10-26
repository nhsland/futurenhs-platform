const gql = require("graphql-tag");
const { createClient } = require("urql");

const { requireEnv } = require("./requireEnv");

//todo: add email address in
const getOrCreateUser = async ({ authId, name, emailAddress }) => {
  const client = createClient({
    url: requireEnv("WORKSPACE_SERVICE_GRAPHQL_ENDPOINT"),
  });
  const query = gql`
    mutation($authId: ID!, $name: String!, $emailAddress: String!) {
      getOrCreateUser(
        newUser: { authId: $authId, name: $name, emailAddress: $emailAddress }
      ) {
        id
        name
        authId
        emailAddress
        isPlatformAdmin
      }
    }
  `;

  const result = await client
    .mutation(query, { authId, name, emailAddress })
    .toPromise();
  if (result.error) {
    throw result.error;
  } else {
    return result.data;
  }
};

const getFileDownloadUrl = async ({ fileId }) => {
  const client = createClient({
    url: requireEnv("WORKSPACE_SERVICE_GRAPHQL_ENDPOINT"),
  });
  const query = gql`
    query GetFileToDownload($id: ID!) {
      fileDownloadUrl(id: $id)
    }
  `;

  const result = await client.query(query, { id: fileId }).toPromise();
  if (result.error) {
    throw result.error;
  } else {
    return result.data;
  }
};

module.exports = {
  getOrCreateUser,
  getFileDownloadUrl,
};
