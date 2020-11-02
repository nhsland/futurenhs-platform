import React, { FC, useState } from "react";

import { useRouter } from "next/dist/client/router";
import { Input, Form, Button } from "nhsuk-react-components";
import { useForm } from "react-hook-form/dist/index.ie11";

import { Textarea } from "../../components/Textarea";
import {
  useCreateFileVersionMutation,
  useFileUploadUrlsMutation,
} from "../../lib/generated/graphql";
import { uploadBlob } from "../../lib/uploadBlob";
import { useMaxLengthHelper } from "../../lib/useMaxLengthHelper";
import {
  FormField,
  StyledButton,
  StyledFileInfoBox,
  StyledFileName,
  StyledHeadingSection,
  StyledInput,
  StyledTag,
} from "./styles";

interface FormData {
  files: FileList;
  fileData: { title: string; description: string };
}
interface Props {
  fileDescription: string;
  fileId: string;
  fileTitle: string;
  folderId: string;
  latestVersionId: string;
  workspaceId: string;
}

const UpdateFileForm: FC<Props> = ({
  fileDescription,
  fileId,
  fileTitle,
  folderId,
  latestVersionId,
  workspaceId,
}) => {
  const { register, handleSubmit, errors, setError } = useForm<FormData>();
  const [, createFileVersion] = useCreateFileVersionMutation();
  const [, fileUploadUrls] = useFileUploadUrlsMutation();

  const router = useRouter();
  const backToPreviousPage = () => router.back();

  const titleMaxLength = useMaxLengthHelper("Title", 50);
  const descriptionMaxLength = useMaxLengthHelper("Description", 250);

  const [fileName, setFileName] = useState<string | undefined>();

  const handleFile = (files: FileList | null) => {
    setFileName(files?.[0]?.name);
  };

  const onSubmit = async (formData: FormData) => {
    try {
      const { error, data } = await fileUploadUrls({ count: 1 });
      if (error) {
        throw new Error(`Failed to get upload URL: ${error.toString()}`);
      }

      if (data) {
        try {
          await uploadBlob(data.fileUploadUrls[0], formData.files[0]);

          const file = await createFileVersion({
            newFileVersion: {
              description: formData.fileData.description,
              file: fileId,
              fileName: formData.files[0].name,
              fileType: formData.files[0].type,
              folder: folderId,
              latestVersion: latestVersionId,
              temporaryBlobStoragePath: data.fileUploadUrls[0],
              title: formData.fileData.title,
            },
          });

          if (file.error) {
            throw new Error(`Failed to save file: ${file.error?.message}`);
          }

          router.push(
            `/workspaces/${workspaceId}/folders/${folderId}/files/${fileId}`
          );
        } catch (error) {
          setError("fileData.title", {
            type: "server",
            message: error.toString(),
          });
        }
      }
    } catch (error) {
      setError("files", {
        type: "server",
        message: error.toString(),
      });
    }
  };
  return (
    <Form id="filesUploadForm" onSubmit={handleSubmit(onSubmit)}>
      <StyledInput
        label="Upload a file *"
        type="file"
        name="files"
        id="files"
        hint="Maximum size 256MB"
        onChange={(e) => handleFile(e.currentTarget.files)}
        inputRef={register({
          required: {
            value: true,
            message: "Please select one or more files",
          },
        })}
        aria-invalid={errors.files ? "true" : "false"}
        error={errors.files?.message}
      />
      <StyledTag>
        All uploaded content must conform to the platform&apos;s{" "}
        <a href="#">Terms and Conditions</a>.
      </StyledTag>
      {fileName && (
        <StyledFileInfoBox>
          <FormField>
            <StyledHeadingSection>
              <StyledFileName>{fileName}</StyledFileName>
            </StyledHeadingSection>
            <Input
              type="text"
              name={`fileData.title`}
              defaultValue={fileTitle}
              label="Update file title (optional)"
              hint="The title of your file should accurately reflect its content or audience"
              onChange={titleMaxLength.onChange}
              inputRef={register({
                required: {
                  value: true,
                  message: "Title is required",
                },
                ...titleMaxLength.validation,
              })}
              error={errors.fileData?.title?.message}
            />
            {titleMaxLength.remainingText(`fileData.title`)}
          </FormField>
          <FormField>
            <Textarea
              name={`fileData.description`}
              defaultValue={fileDescription}
              label="Update description (optional)"
              error={errors.fileData?.description?.message}
              hint="This is the description as seen by users"
              onChange={descriptionMaxLength.onChange}
              inputRef={register(descriptionMaxLength.validation)}
            />
            {descriptionMaxLength.remainingText(`fileData.description`)}
          </FormField>
        </StyledFileInfoBox>
      )}

      <Button type="submit" name="submitButton">
        Upload and continue
      </Button>
      <StyledButton secondary type="button" onClick={backToPreviousPage}>
        Discard
      </StyledButton>
    </Form>
  );
};

export default UpdateFileForm;
