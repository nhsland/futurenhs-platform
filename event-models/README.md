# Event Models

- Manually generated
- Each model has:
  - Rust types
  - TypeScript types
  - a JSON example
- There is a test for each language and model, which:
  - Deserializes the example
  - Serializes it back
  - Compares the result to the example
