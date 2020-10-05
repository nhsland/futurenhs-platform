import { DocumentNode } from "graphql";
import { makeResult, Client, Operation, createClient } from "urql";
import { fromValue } from "wonka";

import { Query } from "../generated/graphql";

export type MockUrqlClient = (
  queries: Array<[DocumentNode, Partial<Query>]>
) => Client;

export const mockUrqlClient: MockUrqlClient = (queries) => {
  const client = createClient({ url: "http://localhost", exchanges: [] });
  return Object.assign(client, {
    executeQuery: jest.fn(({ query }) => {
      const operation: Operation = {
        context: {} as any,
        key: 1,
        operationName: "query",
        query,
      };
      const data = queries.find((q) => q[0] === query);
      return fromValue(
        data
          ? makeResult(operation, { data: data[1] })
          : makeResult(operation, {
              error: "query not found",
            })
      );
    }),
  });
};
