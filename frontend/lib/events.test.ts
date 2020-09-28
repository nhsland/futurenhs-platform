import EventGridClient from "azure-eventgrid";

import { sendEvent } from "./events";
import { withMockedConsole } from "./test-helpers/console";
import { withEnvVars } from "./test-helpers/environment";

jest.mock("azure-eventgrid");

const mockedEventGridClient = EventGridClient as jest.Mocked<
  typeof EventGridClient
>;

describe(sendEvent, () => {
  describe("with env vars", () => {
    withEnvVars({
      EVENTGRID_TOPIC_ENDPOINT: "http://my-topic.azure.local/events",
      EVENTGRID_TOPIC_KEY: "mySecretKey",
    });

    test("sends event to event grid", async () => {
      await sendEvent({
        id: "id",
        subject: "test",
        eventTime: "2020-01-01T12:00:00Z",
        eventType: "ContentViewed",
        data: {
          contentId: "",
          contentType: "Folder",
          userId: "",
          workspaceId: "",
        },
        dataVersion: "1",
      });

      expect(mockedEventGridClient).toHaveBeenCalledTimes(1);
      expect(
        mockedEventGridClient.prototype.publishEvents
      ).toHaveBeenCalledWith("my-topic.azure.local", [
        {
          id: expect.any(String),
          subject: "test",
          eventType: "ContentViewed",
          eventTime: expect.any(Date),
          data: {
            contentId: "",
            contentType: "Folder",
            userId: "",
            workspaceId: "",
          },
          dataVersion: "1",
        },
      ]);
    });
  });

  describe("without env vars", () => {
    const mockedConsole = withMockedConsole();

    test("logs event to console", async () => {
      await sendEvent({
        id: "id",
        subject: "test",
        eventTime: "2020-01-01T12:00:00Z",
        eventType: "ContentViewed",
        data: {
          contentId: "",
          contentType: "Folder",
          userId: "",
          workspaceId: "",
        },
        dataVersion: "1",
      });

      expect(mockedConsole.log).toHaveBeenCalledTimes(1);
    });
  });
});
