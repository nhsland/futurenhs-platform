import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `_Any` scalar is used to pass representations of entities from external services into the root `_entities` field for execution. */
  _Any: any;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new workspace (returns the created workspace) */
  createWorkspace: Workspace;
  /** Update workspace(returns updated workspace */
  updateWorkspace: Workspace;
  /** Delete workspace(returns deleted workspace */
  deleteWorkspace: Workspace;
};


export type MutationCreateWorkspaceArgs = {
  workspace: NewWorkspace;
};


export type MutationUpdateWorkspaceArgs = {
  id: Scalars['ID'];
  workspace: UpdateWorkspace;
};


export type MutationDeleteWorkspaceArgs = {
  id: Scalars['ID'];
};

export type NewWorkspace = {
  title: Scalars['String'];
  longDescription: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Get all Workspaces */
  workspaces: Array<Workspace>;
  /** Get workspace by ID */
  workspace: Workspace;
  _service: _Service;
  _entities: Array<Maybe<_Entity>>;
};


export type QueryWorkspaceArgs = {
  id: Scalars['ID'];
};


export type Query_EntitiesArgs = {
  representations: Array<Scalars['_Any']>;
};

export type UpdateWorkspace = {
  title: Scalars['String'];
  longDescription: Scalars['String'];
};

/** A workspace */
export type Workspace = {
  __typename?: 'Workspace';
  /** The id of the workspace */
  id: Scalars['ID'];
  /** The title of the workspace */
  title: Scalars['String'];
  /** The description of the workspace */
  longDescription: Scalars['String'];
};


export type _Entity = Workspace;

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']>;
};

export type CreateWorkspaceMutationMutationVariables = Exact<{
  title: Scalars['String'];
  longDescription: Scalars['String'];
}>;


export type CreateWorkspaceMutationMutation = (
  { __typename?: 'Mutation' }
  & { createWorkspace: (
    { __typename?: 'Workspace' }
    & Pick<Workspace, 'id' | 'title' | 'longDescription'>
  ) }
);


export const CreateWorkspaceMutationDocument = gql`
    mutation CreateWorkspaceMutation($title: String!, $longDescription: String!) {
  createWorkspace(workspace: {title: $title, longDescription: $longDescription}) {
    id
    title
    longDescription
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateWorkspaceMutation(variables: CreateWorkspaceMutationMutationVariables): Promise<CreateWorkspaceMutationMutation> {
      return withWrapper(() => client.request<CreateWorkspaceMutationMutation>(print(CreateWorkspaceMutationDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;