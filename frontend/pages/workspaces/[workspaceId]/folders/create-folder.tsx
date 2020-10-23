import React, { useState } from "react";

import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { Input, Form, Button, ErrorMessage } from "nhsuk-react-components";
import { useForm } from "react-hook-form/dist/index.ie11";
import styled from "styled-components";

import { H2 } from "../../../../components/H2";
import { MainHeading } from "../../../../components/MainHeading";
import { NavHeader } from "../../../../components/NavHeader";
import { Navigation } from "../../../../components/Navigation";
import { PageLayout } from "../../../../components/PageLayout";
import { Textarea } from "../../../../components/Textarea";
import {
  Folder,
  useCreateFolderMutation,
  useGetWorkspaceByIdQuery,
} from "../../../../lib/generated/graphql";
import withUrqlClient from "../../../../lib/withUrqlClient";

const ContentWrapper = styled.div`
  display: flex;
`;

const FormField = styled.div`
  padding-bottom: 40px;
  #text {
    padding-bottom: 60px;
  }
`;

const PageContent = styled.div`
  ${({ theme }) => `
  background-color: ${theme.colorNhsukWhite};
  min-height: 100vh;
  padding-top: 24px;
  padding-left: 10%;
  padding-right: 10%;
  .nhsuk-form-group {
    margin-bottom: 8px;
  }
  `}
`;

const StyledButton = styled(Button)`
  margin-left: 12px;
`;

const MAX_CHARS: { [key: string]: number } = {
  title: 100,
  description: 250,
};

const CreateFolder: NextPage = () => {
  const router = useRouter();
  const workspaceId = (router.query.workspaceId || "unknown").toString();

  const [remainingChars, setRemainingChars] = useState({
    title: null,
    description: null,
  });

  const { errors, handleSubmit, register, setError } = useForm();

  const [{ data, fetching, error }] = useGetWorkspaceByIdQuery({
    variables: { id: workspaceId },
  });

  const [, createFolder] = useCreateFolderMutation();

  if (error) return <p> Oh no... {error?.message} </p>;
  if (fetching || !data) return <p>Loading...</p>;

  const backToPreviousPage = () => router.back();

  const onSubmit = async (newFolder: Folder) => {
    createFolder({ ...newFolder, workspace: workspaceId }).then((result) => {
      if (result.data) {
        router.push(
          `/workspaces/${workspaceId}/folders/${result.data.createFolder.id}`
        );
      } else {
        setError("form", {
          type: "server",
          message: "Error creating folder",
        });
      }
    });
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
      <NavHeader />
      <ContentWrapper>
        <Navigation
          workspaceId={workspaceId}
          workspaceTitle={data.workspace.title}
          activeFolder={"active"}
        />
        <PageContent>
          <MainHeading>Create a folder</MainHeading>
          <H2 title="Folder details" />
          <p> Fields marked with * are mandatory.</p>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <Input
                name="title"
                onChange={handleCharNumber}
                id="title"
                label="Enter folder title*"
                hint="The title of your folder should accurately reflect its content or audience"
                inputRef={register({
                  required: true,
                  maxLength: MAX_CHARS.title,
                })}
                error={
                  errors.title &&
                  `Folder name is required and cannot be longer than ${MAX_CHARS.title} characters`
                }
              />
              {`${
                remainingChars.title || MAX_CHARS.title
              } characters remaining`}
            </FormField>

            <FormField>
              <Textarea
                name="description"
                onChange={handleCharNumber}
                id="description"
                label="Description"
                error={
                  errors.description &&
                  `Description must be a maximum of ${MAX_CHARS.description} characters`
                }
                hint="This is the description as seen by users"
                inputRef={register({
                  required: false,
                  maxLength: MAX_CHARS.description,
                })}
              />
              {`${
                remainingChars.description || MAX_CHARS.description
              } characters remaining`}
            </FormField>
            <Button type="submit" name="submitButton">
              Save and complete
            </Button>
            <StyledButton secondary type="button" onClick={backToPreviousPage}>
              Discard
            </StyledButton>
            {errors.server && <ErrorMessage>{errors.server}</ErrorMessage>}
          </Form>
        </PageContent>
      </ContentWrapper>
    </PageLayout>
  );
};

export default withUrqlClient(CreateFolder);
