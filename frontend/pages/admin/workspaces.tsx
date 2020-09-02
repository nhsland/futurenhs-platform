import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../../lib/generated/graphql";
import { Header } from "../../components/Header";
import { PageLayout } from "../../components/PageLayout";
import styled from "styled-components";

const MAX_CHARS = {
  title: 100,
  description: 250,
};

interface Workspace {
  id: string;
  title: string;
  longDescription: string;
}

// const APOLLO_GATEWAY = `${process.env.ORIGIN}/api/graphql`;

const StyledPageContent = styled.div`
  ${({ theme }) => `
  background-color: ${theme.colorNhsukWhite};
  `}
`;

const CreateWorkspace = () => {
  const [remainingChars, setRemainingChars] = useState({
    title: "",
    description: "",
  });

  const { errors, handleSubmit, register } = useForm();
  const onSubmit = async (data: Workspace) => {
    try {
      const client = new GraphQLClient("http://localhost:3000/api/graphql");
      const sdk = getSdk(client);
      await sdk.CreateWorkspaceMutation(data);
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
    <PageLayout>
      <Header
        imageRight={require("../../public/NHS.png")}
        imageRightURL="https://www.nhs.co.uk"
        imageRightAltText="NHS logo"
      />
      <StyledPageContent>
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
              name="longDescription"
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
      </StyledPageContent>
    </PageLayout>
  );
};

export default CreateWorkspace;
