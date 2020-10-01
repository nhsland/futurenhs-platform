# Frontend

## How to use

The frontend development server relies on some services that are available in the development cluster. Specifically, it calls out to the hello-world service when doing server-side rendering, and also proxies `/hello/*` to `http://hello-world.hello-world/hello/*` like how our nginx ingress does in production.

It is possible to either run your frontend;

- **locally**, using a stub server for graphQL requests,
- or against the **workspace service**, using port forwarding.

### Running locally

by not setting the environment variable `WORKSPACE_SERVICE_GRAPHQL_ENDPOINT` in your `env.local` or `.env` files, the service will default to the value in `.env.development`, which points to the local stub server.

```
WORKSPACE_SERVICE_GRAPHQL_ENDPOINT=http://localhost:3001/graphql
```

When running `yarn dev` (which starts up both the frontend service and the stub server), you will be making requests against the workspace service stubbed graphQL server, meaning there are no external dependencies for local development.

### Running against your cluster workspace service

In order to set up a development cluster, see [infrastructure docs](../infrastructure/README.md). Once your development cluster is set up, install `kubefwd` in order to port-forward the workspace service from your cluster and run it;

```bash
brew install txn2/tap/kubefwd
sudo kubefwd services -n hello-world -n workspace-service
```

Set the environment variable for the `WORKSPACE_SERVICE_GRAPHQL_ENDPOINT` to the following value in your `.env.local` file;

```
WORKSPACE_SERVICE_GRAPHQL_ENDPOINT=http://workspace-service.workspace-service/graphql
```

Now, when running `yarn dev` the frontend will call the `workspace-service` in your cluster rather than the local stub server.

### Using Azure Active Directory login

By default, when running `yarn dev` your service will mock login, rather than communicating with Azure, in order to reduce dependencies. It is, however, possible to replicate production locally and login normally.

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

## Testing

### Cypress

Cypress tests run as part of our CI pipeline. It's also possible to run in a local browser before pushing code.

To run tests, execute the following command:

- for a local server, stub graphql server and test runner: `yarn cypress:local`.

This will open the test runner. You can then select a test you want to run and which browser (Chrome/Firefox/Chromium Edge) you would like to run it in.
