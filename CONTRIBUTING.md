# Contributing

From opening bug reports to creating pull requests: every contribution is appreciated and welcome. If you're planning to implement a new feature or change the way an existing feature works please create an issue first. This way we can ensure that your work is not wasted.

## Process

1. Software requirements are mentioned in the main [README](./README.md) and READMEs of the individual components. You will most likely need a combination of [Docker](https://www.docker.com/products/docker-desktop), [Node.js](https://nodejs.org) and [Rust](https://rustup.rs) installed on your machine.

1. Fork, then clone the repository.

1. Create a new branch based on master and start to make your changes.

   ```sh
   git checkout -b my-feature
   ```

1. Once you're happy, push your branch and [open a pull request](https://github.com/FutureNHS/futurenhs-platform/compare) ([help](https://help.github.com/articles/creating-a-pull-request/)).

   ```sh
   git push origin -u my-feature
   ```

## Additional notes

Some things that will increase the chance that your pull request is accepted:

- Write tests
- Follow the existing coding style
- Write a [good commit message](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
