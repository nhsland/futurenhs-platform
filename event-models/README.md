# Event Models

As described in [Data Flow](../docs/data-flow/README.md), the FutureNHS platform publishes events for everything that happens (e.g. user uploaded file, left a comment or viewed a page). The event models here contain:

- A [centralized schema](./schema.json) for all events published by the platform.
- Types for [Rust](./rust) and [TypeScript](./typescript), which make it easy to both publish and consume events from different parts of the platform.

The centralized schema is written as a [JSON Schema](https://json-schema.org) and follows the [Azure EventGrid schema](https://docs.microsoft.com/en-us/azure/event-grid/event-schema) for events.

## Update schema

If you need to update the schema, e.g. to add a new event, follow these steps:

1. Edit the [schema.json](./schema.json) file
2. Update the TypeScript types by running `yarn generate` in the [`typescript`](./typescript) folder.
3. Update the Rust types by adding a line to the `event_serialization!` macro invocation in [`models.rs`](./rust/src/models.rs).
