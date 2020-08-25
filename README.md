# Platform

## Documentation

- [General](./docs)
- [Infrastructure](./infrastructure)

## Recommended tools for developers

NOTE: You can find information on setting up the cluster and relevent tooling [here](infrastructure/README.md).

### Connecting to databases in your cluster

[TablePlus](https://www.tableplus.io/download) might be useful.

### Linting

The following are used within CI to verify formatting. You may find it useful to use locally too.

- [shfmt](https://github.com/mvdan/sh)
- [rustfmt](https://github.com/rust-lang/rustfmt)
- [prettier](https://prettier.io)
- [eslint](https://eslint.org/)

Note: Prettier formats all relevent code in this repo, and therefore is installed at the top level. Run `yarn` to install.
