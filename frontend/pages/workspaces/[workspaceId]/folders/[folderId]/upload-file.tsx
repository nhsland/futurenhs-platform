import React, { useState } from "react";

import { BlockBlobClient } from "@azure/storage-blob";
import { ErrorMessage as HookFormErrorMessage } from "@hookform/error-message";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { Input, Form, Button, ErrorMessage } from "nhsuk-react-components";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Client } from "urql";

import { MainHeading } from "../../../../../components/MainHeading";
import { NavHeader } from "../../../../../components/NavHeader";
import { Navigation } from "../../../../../components/Navigation";
import { PageLayout } from "../../../../../components/PageLayout";
import {
  FileUploadUrlDocument,
  useGetFolderByIdQuery,
  useGetWorkspaceByIdQuery,
} from "../../../../../lib/generated/graphql";
import withUrqlClient from "../../../../../lib/withUrqlClient";

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
  title: 50,
};

interface FormData {
  title: string;
  files: FileList;
}

const UploadFile: NextPage<any> = ({ urqlClient }: { urqlClient: Client }) => {
  const router = useRouter();
  const workspaceId = (router.query.workspaceId || "unknown").toString();
  const folderId = (router.query.folderId || "unknown").toString();

  const [remainingChars, setRemainingChars] = useState({
    title: null,
    description: null,
  });

  const { errors, handleSubmit, register, setError } = useForm();

  const [workspace] = useGetWorkspaceByIdQuery({
    variables: { id: workspaceId },
  });
  const [folder] = useGetFolderByIdQuery({
    variables: { id: folderId },
  });

  if (workspace.error || folder.error)
    return (
      <p>
        {" "}
        Oh no... {workspace.error?.message} {folder.error?.message}{" "}
      </p>
    );
  if (workspace.fetching || folder.fetching || !workspace.data || !folder.data)
    return <p>Loading...</p>;

  const backToPreviousPage = () => router.back();

  const onSubmit = async (formData: FormData) => {
    urqlClient
      .query(FileUploadUrlDocument)
      .toPromise()
      .then(({ error, data }) => {
        const { title, files } = formData;
        if (error) {
          setError("form", {
            type: "server",
            message: error.toString(),
          });
        }
        if (data) {
          const blobClient = new BlockBlobClient(data.fileUploadUrl);
          blobClient
            .uploadBrowserData(files[0], {
              maxSingleShotSize: 4 * 1024 * 1024,
            })
            .then(() => {
              blobClient
                .setMetadata({ title, filename: files[0].name })
                .then(() => {
                  router.push(`/workspaces/${workspaceId}/folders/${folderId}`);
                });
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
          workspaceTitle={workspace.data?.workspace.title || "unknown"}
          activeFolder={folderId}
        />
        <PageContent>
          <MainHeading withBorder>
            {folder.data?.folder.title || "unknown"}
          </MainHeading>
          <p> Fields marked with * are mandatory.</p>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <Input
                name="title"
                onChange={handleCharNumber}
                id="title"
                label="Enter file title*"
                hint="This is the file title as seen by users. Try to be as descriptive as possible. "
                inputRef={register({
                  required: true,
                  maxLength: MAX_CHARS.title,
                })}
                aria-invalid={errors.title ? "true" : "false"}
                error={
                  errors.title &&
                  `File title is required and cannot be longer than ${MAX_CHARS.title} characters`
                }
              />
              {`${
                remainingChars.title || MAX_CHARS.title
              } characters remaining`}
              {errors.title?.type === "required" && (
                <p role="alert">This is required</p>
              )}
            </FormField>
            <FormField>
              <Input
                type="file"
                name="files"
                id="files"
                label="Upload a file*"
                hint="Maximum size 10GB"
                inputRef={register({
                  required: true,
                })}
                aria-invalid={errors.files ? "true" : "false"}
                error={errors.files && `Please select a file`}
              />
              {errors.files?.type === "required" && (
                <p role="alert">This is required</p>
              )}
            </FormField>
            <p>
              All uploaded content must conform to to the platform&apos;s{" "}
              <a href="#">Terms and Conditions</a>.
            </p>
            <Button type="submit" name="submitButton">
              Save and continue
            </Button>
            <StyledButton secondary type="button" onClick={backToPreviousPage}>
              Discard
            </StyledButton>
            <HookFormErrorMessage
              errors={errors}
              name="server"
              as={<ErrorMessage />}
            />
          </Form>
        </PageContent>
      </ContentWrapper>
    </PageLayout>
  );
};

export default withUrqlClient(UploadFile);
