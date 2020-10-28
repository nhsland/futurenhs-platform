import { BlockBlobClient } from "@azure/storage-blob";

export const uploadBlob = async (url: string, file: File) => {
  const blobClient = new BlockBlobClient(url);
  const uploadResponse = await blobClient.uploadBrowserData(file, {
    maxSingleShotSize: 4 * 1024 * 1024,
  });

  if (uploadResponse.errorCode) {
    throw new Error(`Failed to upload file: ${uploadResponse.errorCode}`);
  }
};
