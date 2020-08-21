# Frontend

## How to use

The frontend development server relies on some services that are available in the development cluster. Specifically, it calls out to the hello-world service when doing server-side rendering, and also proxies `/hello/*` to `http://hello-world.hello-world/hello/*` like how our nginx ingress does in production.

In order to set up a development cluster, see [infrastructure docs](../infrastructure/README.md). Once your development cluster is set up, you should run this to make the cluster's services available for local development:

```bash
sudo kubefwd services -n hello-world
```

In order to login you will also need to add our shared OAuth 2 client secret to your local environment variables. Ask a coworker for the secret, then create a file called `.env.development.local` with the following content:

```
AAD_B2C_CLIENT_SECRET=<secret>
```

Once that is all set up, start the dev server like this:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.
