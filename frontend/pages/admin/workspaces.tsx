import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { GraphQLClient, gql } from "graphql-request";
import { GetStaticProps } from "next";

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

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: Props;
}> => {
  const endpoint = "http://localhost:3030/graphql";

  const graphQLClient = new GraphQLClient(endpoint, {
    credentials: "include",
    mode: "cors",
  });

  const query = gql`
    {
      workspaces {
        id
        title
      }
    }
  `;

  const { workspaces } = await graphQLClient.request(query);
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
  const router = useRouter();
  const onSubmit = () => {
    router.push("/");
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
