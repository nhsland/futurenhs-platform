# Event Models

This thing:

- Generates TypeScript types and validation from a JSON schema using special node modules

- Generates Rust structs using a special crate from the same JSON schema

Another idea:

- Manually generated
- Each model has:
  - Rust types
  - TypeScript types (but how do we generate runtime validation?)
  - a JSON example
- There is a test for each language and model, which:
  - Deserializes the example
  - Serializes it back
  - Compares the result to the example
