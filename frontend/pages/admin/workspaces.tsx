// import { request, gql } from "graphql-request";
import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
// import { GetServerSideProps } from "next";

const MAX_DESCRIPTION_CHARS = 100;
const MAX_TITLE_CHARS = 250;

const CreateWorkspace = () => {
  const { errors, handleSubmit, register } = useForm();
  const router = useRouter();
  const onSubmit = () => {
    console.log("Hello");
    router.push("/");
  };

  const handleDiscard = () => {
    // clear form elements
    router.push("/");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
            ref={register({ required: true, maxLength: MAX_TITLE_CHARS })}
          />
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
            ref={register({
              required: false,
              maxLength: MAX_DESCRIPTION_CHARS,
            })}
          />
        </div>
        <input type="submit" value="Save and complete" />
      </form>
      <button onClick={handleDiscard}>Discard</button>
    </div>
  );
};

export default CreateWorkspace;
