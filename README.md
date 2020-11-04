# Platform

## Documentation

- [General](./docs)
- [Infrastructure](./infrastructure)

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md) for the contribution process.

See READMEs of the individual components to get started:

- Go to [infrastructure](./infrastructure) to make changes to the infrastructure components in Azure, such as the Kubernetes cluster, PostgreSQL server or Azure Storage. The README shows how to setup your own development environment, so you can test your changes before applying them to production.
- Go to [frontend](./frontend) to make changes to the website.
- Go to [workspace-service](./workspace-service) to make changes to the backend and GraphQL API for workspaces.
- Go to [event-models](./event-models) to add new event models or extend existing ones.
- Go to [test](./test) to make changes to Selenium tests for Internet Explorer.

To start an instance of the platform locally, open 2 terminals and run:

```console
cd workspace-service && make run-local
cd frontend && WORKSPACE_SERVICE_GRAPHQL_ENDPOINT=http://localhost:3030/graphql yarn dev
```

## Linting

The following tools are used within CI to verify formatting. You may find it useful to use them locally, too.

- [shfmt](https://github.com/mvdan/sh)
- [rustfmt](https://github.com/rust-lang/rustfmt)
- [prettier](https://prettier.io)
- [eslint](https://eslint.org)

Note: Prettier formats all relevent code in this repo, and therefore is installed at the top level. Run `yarn` to install.

## Licence

Unless stated otherwise, the codebase is released under [the MIT License][mit]. This covers both the codebase and any sample code in the documentation.

The documentation is [© Crown copyright][copyright] and available under the terms of the [Open Government 3.0][ogl] licence.

[mit]: LICENCE
[copyright]: http://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/
[ogl]: http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
