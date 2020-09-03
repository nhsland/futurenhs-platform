import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../../lib/generated/graphql";
import { Header } from "../../components/Header";
import { PageLayout } from "../../components/PageLayout";
import { Textarea } from "../../components/Textarea";
import styled from "styled-components";
import { Input, Form, Button } from "nhsuk-react-components";

const MAX_CHARS: { [key: string]: number } = {
  title: 100,
  longDescription: 250,
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
  h3 {
    color: ${theme.colorNhsukGrey1} 
  }
  `}
`;

const CreateWorkspace = () => {
  const [remainingChars, setRemainingChars] = useState({
    title: null,
    longDescription: null,
  });

  const { errors, handleSubmit, register } = useForm();
  const onSubmit = async (data: Workspace) => {
    try {
      const client = new GraphQLClient("http://localhost:3000/api/graphql");
      const sdk = getSdk(client);
      await sdk.CreateWorkspaceMutation(data);
    } catch (error) {
      console.log("Create workspace failed", error);
    }
  };

  const handleCharNumber = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRemainingChars({
      ...remainingChars,
      [event.currentTarget.name]:
        MAX_CHARS[event.currentTarget.name] - event.currentTarget.value.length,
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
        <h2>Create a workspace</h2>
        <h3>Workspace details</h3>
        <p> Fields marked with * are required.</p>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              name="title"
              onChange={handleCharNumber}
              id="title"
              label="Name of workspace*"
              hint="This is the name of the workspace as seen by users of FutureNHS."
              inputRef={register({
                required: true,
                maxLength: MAX_CHARS.title,
              })}
              error={errors.title && "Workspace name is required"}
            />
            {`${remainingChars.title || MAX_CHARS.title} characters remaining`}
          </div>

          <div>
            <Textarea
              name="longDescription"
              onChange={handleCharNumber}
              id="longDescription"
              label="Description"
              hint="This is the description as seen by users. Don't repeat the workspace name here. Do try to be as descriptive as possible"
              inputRef={register({
                required: false,
                maxLength: MAX_CHARS.longDescription,
              })}
            />
            {`${
              remainingChars.longDescription || MAX_CHARS.longDescription
            } characters remaining`}
          </div>
          <Button type="submit">Save and complete</Button>
        </Form>
      </StyledPageContent>
    </PageLayout>
  );
};

export default CreateWorkspace;
