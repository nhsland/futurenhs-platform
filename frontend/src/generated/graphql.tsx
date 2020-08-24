export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type MutationRoot = {
  __typename?: "MutationRoot";
  createWorkspace: Workspace;
  updateWorkspace: Workspace;
  deleteWorkspace: Workspace;
};

export type MutationRootCreateWorkspaceArgs = {
  workspace: NewWorkspace;
};

export type MutationRootUpdateWorkspaceArgs = {
  id: Scalars["ID"];
  workspace: UpdateWorkspace;
};

export type MutationRootDeleteWorkspaceArgs = {
  id: Scalars["ID"];
};

export type NewWorkspace = {
  title: Scalars["String"];
};

export type QueryRoot = {
  __typename?: "QueryRoot";
  workspaces: Array<Workspace>;
  workspace: Workspace;
};

export type QueryRootWorkspaceArgs = {
  id: Scalars["ID"];
};

export type UpdateWorkspace = {
  title: Scalars["String"];
};

export type Workspace = {
  __typename?: "Workspace";
  id: Scalars["ID"];
  title: Scalars["String"];
};
