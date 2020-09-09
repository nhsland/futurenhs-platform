import { Event } from "@fnhs/event-models";
import EventGridClient from "azure-eventgrid";
import { TopicCredentials } from "ms-rest-azure";
import { v4 as uuid } from "uuid";

export const sendEvent = async (event: Event) => {
  const fullEvent = {
    id: uuid(),
    subject: event.subject,
    eventType: event.eventType,
    eventTime: new Date(),
    data: event.data,
    dataVersion: event.dataVersion,
  };
  const key = process.env.EVENTGRID_TOPIC_KEY;
  const endpoint = process.env.EVENTGRID_TOPIC_ENDPOINT;
  if (key && endpoint) {
    const client = new EventGridClient(new TopicCredentials(key));
    const topicHostname = new URL(endpoint).host;
    await client.publishEvents(topicHostname, [fullEvent]);
  } else {
    console.log(`EVENT: ${JSON.stringify(fullEvent)}`);
  }
};
