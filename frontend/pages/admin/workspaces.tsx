import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GraphQLClient } from "graphql-request";
import { GetServerSideProps } from "next";
import { getSdk } from "../../generated/graphql";

const MAX_CHARS = {
  title: 100,
  description: 250,
};

interface Workspace {
  id: string;
  title: string;
}

interface Props {
  workspaces: Workspace[];
}

const APOLLO_GATEWAY = `${process.env.ORIGIN}/api/graphql`;

export const getServerSideProps: GetServerSideProps = async () => {
  const client = new GraphQLClient(APOLLO_GATEWAY);
  const sdk = getSdk(client);
  const { workspaces } = await sdk.WorkspacesQuery();

  return {
    props: {
      workspaces,
    },
  };
};

const CreateWorkspace = ({ workspaces }: Props) => {
  const [remainingChars, setRemainingChars] = useState({
    title: "",
    description: "",
  });

  const { errors, handleSubmit, register } = useForm();
  const onSubmit = async () => {
    try {
      const client = new GraphQLClient(APOLLO_GATEWAY);
      const sdk = getSdk(client);
      await sdk.CreateWorkspaceMutation({ title: "Kite" });
      console.log("Success");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCharNumber = (event: any) => {
    setRemainingChars({
      ...remainingChars,
      [event.target.name]:
        // @ts-ignore TODO
        MAX_CHARS[event.target.name] - event.target.value.length,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p>Current workspaces</p>
      <ul>
        {workspaces?.map((workspace: Workspace) => (
          <li key={workspace.title}>{workspace.title}</li>
        ))}
      </ul>
      <h1>Create a workspace</h1>
      <h2>Workspace details</h2>
      <p> Fields marked with * are required.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h3>
            <label>Name of workspace*</label>
          </h3>
          <p>
            This is the name of the workspace as seen by users of FutureNHS.
          </p>
          <input
            name="title"
            onChange={handleCharNumber}
            ref={register({ required: true, maxLength: MAX_CHARS.title })}
          />
          {`${remainingChars.title} characters remaining`}
          {errors.title && "Workspace name is required"}
        </div>

        <div>
          <h3>
            <label>Description</label>
          </h3>
          <p>
            This is the description as seen by users. Don&apos;t repeat the
            workspace name here. Do try to be as descriptive as possible
          </p>

          <textarea
            name="description"
            onChange={handleCharNumber}
            ref={register({
              required: false,
              maxLength: MAX_CHARS.description,
            })}
          />
          {`${remainingChars.description} characters remaining`}
        </div>
        <input type="submit" value="Save and complete" />
      </form>
    </div>
  );
};

export default CreateWorkspace;
