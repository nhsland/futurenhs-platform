import { v4 as uuid } from "uuid";
import EventGridClient from "azure-eventgrid";
import { TopicCredentials } from "ms-rest-azure";

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Environment variable ${name} required but not specified or empty`
    );
  }

  return value;
};

export interface Event {
  subject: string;
  eventType: string;
  data: any;
  dataVersion: string;
}

export const sendEvent = async (event: Event) => {
  const fullEvent = {
    id: uuid(),
    subject: event.subject,
    eventType: event.eventType,
    eventTime: new Date(),
    data: event.data,
    dataVersion: event.dataVersion,
  };
  const client = new EventGridClient(
    new TopicCredentials(requireEnv("EVENTGRID_TOPIC_KEY"))
  );
  await client.publishEvents(requireEnv("EVENTGRID_TOPIC_ENDPOINT"), [
    fullEvent,
  ]);
};
