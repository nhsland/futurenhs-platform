# Frontend

The website is built in [TypeScript](https://typescriptlang.org), using [Next.js](https://nextjs.org).

## How to use

The frontend development server relies on the following external services, which are called during server-side rendering and through a GraphQL federation proxy at `/api/graphql`.

- workspace service: configured through the `WORKSPACE_SERVICE_GRAPHQL_ENDPOINT` environment variable

It is possible to either run your frontend:

- Against a stub server. This is useful if you don't care about server-side validation logic, etc.
- Against the actual workspace service.

### Stub server

By default the `WORKSPACE_SERVICE_GRAPHQL_ENDPOINT` will be read from `.env.development` and point to the stub server at `http://localhost:3001/graphql`.

When running `yarn dev` (which starts up both the frontend service and the stub server), you will be making requests against the workspace service stubbed GraphQL server, meaning there are no external dependencies for local development.

### Actual workspace service

To work against the real thing, start the workspace service locally. Then set the environment variable for the `WORKSPACE_SERVICE_GRAPHQL_ENDPOINT` to the following value in your `.env.development.local` file:

```
WORKSPACE_SERVICE_GRAPHQL_ENDPOINT=http://localhost:3030/graphql
```

Now, when running `yarn dev` the frontend will call the local `workspace-service` rather than the stub server.

### Using Azure Active Directory login

By default, when running `yarn dev` your service will mock login, rather than communicating with Azure Active Directory B2C, in order to reduce dependencies. It is, however, possible to replicate production locally and login normally.

In order to login you will also need to add our shared OAuth 2 client secret to your local environment variables. Fetch it from your dev cluster with `kubectl get secret -n frontend sessions -o jsonpath={.data.AAD_B2C_CLIENT_SECRET} | base64 -D | fmt`, then create a file called `.env.local` with the following content:

```
AAD_B2C_CLIENT_SECRET=<secret>
```

Once that is all set up, start the server like this:

```bash
yarn build
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

### Permissions

Parts of the application rely on permissions, such as the platform admin permission. By default the system is installed with a single platform admin. This has `auth_id="feedface-0000-0000-0000-000000000000"` and `is_platform_admin` set to `true.` This is the user that `yarn dev` uses by default.

All other users are created when you log in using Azure Active Directory B2C and are not platform admin.

If you need to make another user platform admin in your development cluster, follow these steps:

- Find your auth id. Go to https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers and select the user you log in with, of `User Type` 'Member'. On the Profile page you are taken to, copy the `Object ID`.

- Port-forward to your workspace service (the examples below assume you forwarded using `kubefwd svc -n workspace-service`).

- Go to <http://workspace-service.workspace-service/graphiql>. In the query box, type:

  ```graphql
  mutation {
    updateUser(updateUser: { authId: YOUR_OBJECT_ID, isPlatformAdmin: true }) {
      isPlatformAdmin
    }
  }
  ```

- In the "HTTP HEADERS" box at the bottom, put:

  ```json
  { "x-user-auth-id": "feedface-0000-0000-0000-000000000000" }
  ```

- Submit the request.

From now on you can go to https://fnhs-dev-\$FNHSNAME.westeurope.cloudapp.azure.com/auth/login?next=/api/graphql on your dev cluster, login, and make any GraphQL query as a platform admin.

## Testing

### Cypress

Cypress tests run as part of our CI pipeline. It's also possible to run in a local browser before pushing code.

To run tests, execute the following command:

- for a local server, stub graphql server and test runner: `yarn cypress:local`.

This will open the test runner. You can then select a test you want to run and which browser (Chrome/Firefox/Chromium Edge) you would like to run it in.
