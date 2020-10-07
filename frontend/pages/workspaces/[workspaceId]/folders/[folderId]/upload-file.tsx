import React, { useState } from "react";

import { BlockBlobClient } from "@azure/storage-blob";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { Input, Form, Button, ErrorMessage } from "nhsuk-react-components";
import { useForm } from "react-hook-form/dist/index.ie11";
import styled from "styled-components";
import { Client } from "urql";

import { MainHeading } from "../../../../../components/MainHeading";
import { NavHeader } from "../../../../../components/NavHeader";
import { Navigation } from "../../../../../components/Navigation";
import { PageLayout } from "../../../../../components/PageLayout";
import {
  FileUploadUrlDocument,
  useCreateFileMutation,
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

type FormData = {
  title: string;
  files: FileList;
};

const UploadFile: NextPage<any> = ({ urqlClient }: { urqlClient: Client }) => {
  const router = useRouter();
  const workspaceId = (router.query.workspaceId || "unknown").toString();
  const folderId = (router.query.folderId || "unknown").toString();

  const [remainingChars, setRemainingChars] = useState({
    title: null,
    description: null,
  });

  const { register, handleSubmit, errors, setError } = useForm<FormData>();

  const [workspace] = useGetWorkspaceByIdQuery({
    variables: { id: workspaceId },
  });
  const [folder] = useGetFolderByIdQuery({
    variables: { id: folderId },
  });
  const [, createFile] = useCreateFileMutation();

  if (workspace.error || folder.error)
    return (
      <p>
        {" "}
        Oh no... {workspace.error?.message} {folder.error?.message}{" "}
      </p>
    );

  const backToPreviousPage = () => router.back();

  const onSubmit = async ({ title, files }: FormData) => {
    try {
      const { error, data } = await urqlClient
        .query(FileUploadUrlDocument)
        .toPromise();
      if (error) {
        throw new Error(`Failed to get upload URL: ${error.toString()}`);
      }
      if (data) {
        const blobClient = new BlockBlobClient(data.fileUploadUrl);
        const uploadResponse = await blobClient.uploadBrowserData(files[0], {
          maxSingleShotSize: 4 * 1024 * 1024,
        });
        if (uploadResponse.errorCode) {
          throw new Error(`Failed to upload file: ${uploadResponse.errorCode}`);
        }
        const fileName = files[0].name;
        const setMetaResponse = await blobClient.setMetadata({
          title,
          fileName,
        });
        if (setMetaResponse.errorCode) {
          throw new Error(
            `Failed to set file metadata: ${setMetaResponse.errorCode}`
          );
        }
        const file = await createFile({
          newFile: {
            description: "TBD", // TODO
            fileName,
            fileType: "png", // TODO
            folder: folderId,
            temporaryBlobStoragePath: data.fileUploadUrl,
            title,
          },
        });
        if (file.error) {
          throw new Error(`Failed to save file: ${file.error?.message}`);
        }
        if (file.data) {
          router.push(
            `/workspaces/${workspaceId}/folders/${folderId}/files/${file.data.createFile.id}`
          );
        }
      }
    } catch (error) {
      setError("files", {
        type: "server",
        message: error.toString(),
      });
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
      <NavHeader />
      <ContentWrapper>
        <Navigation
          workspaceId={workspaceId}
          workspaceTitle={
            workspace.fetching
              ? "Loading..."
              : workspace.data?.workspace.title || "No title!"
          }
          activeFolder={folderId}
        />
        <PageContent>
          <MainHeading withBorder>
            {folder.fetching
              ? "Loading..."
              : folder.data?.folder.title || "No title!"}
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
                  required: { value: true, message: "File title is required" },
                  maxLength: {
                    value: MAX_CHARS.title,
                    message: `File title cannot be longer than ${MAX_CHARS.title} characters`,
                  },
                })}
                aria-invalid={errors.title ? "true" : "false"}
                error={errors.title?.message}
              />
              {`${
                remainingChars.title || MAX_CHARS.title
              } characters remaining`}
            </FormField>
            <FormField>
              <Input
                type="file"
                name="files"
                id="files"
                label="Upload a file*"
                hint="Maximum size 10GB"
                inputRef={register({
                  required: { value: true, message: "Please select a file" },
                })}
                aria-invalid={errors.files ? "true" : "false"}
                error={errors.files?.message}
              />
            </FormField>
            <p>
              All uploaded content must conform to the platform&apos;s{" "}
              <a href="#">Terms and Conditions</a>.
            </p>
            <Button type="submit" name="submitButton">
              Save and continue
            </Button>
            <StyledButton secondary type="button" onClick={backToPreviousPage}>
              Discard
            </StyledButton>
            {errors.title && (
              <ErrorMessage>{errors.title.message}</ErrorMessage>
            )}
            {errors.files && (
              <ErrorMessage>{errors.files.message}</ErrorMessage>
            )}
          </Form>
        </PageContent>
      </ContentWrapper>
    </PageLayout>
  );
};

export default withUrqlClient(UploadFile);
