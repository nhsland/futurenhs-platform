import { Event } from "@fnhs/event-models";
import EventGridClient from "azure-eventgrid";
import { TopicCredentials } from "ms-rest-azure";

export const sendEvent = async (event: Event) => {
  const eventGridEvent = {
    ...event,
    eventTime: new Date(event.eventTime),
  };
  const key = process.env.EVENTGRID_TOPIC_KEY;
  const endpoint = process.env.EVENTGRID_TOPIC_ENDPOINT;
  if (key && endpoint) {
    const client = new EventGridClient(new TopicCredentials(key));
    const topicHostname = new URL(endpoint).host;
    await client.publishEvents(topicHostname, [eventGridEvent]);
  } else {
    console.log(`EVENT: ${JSON.stringify(eventGridEvent)}`);
  }
};
