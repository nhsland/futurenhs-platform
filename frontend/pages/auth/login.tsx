import React from "react";
import { GetServerSideProps } from "next";
import { generateFields, FormConfig } from "../../lib/login";
import { v4 as uuid } from "uuid";
import EventGridClient from "azure-eventgrid";
import { TopicCredentials } from "ms-rest-azure";

interface Event {
  subject: string;
  eventType: string;
  data: any;
  dataVersion: string;
}

const sendEvent = async (event: Event) => {
  const loginAttemptEvent = {
    id: uuid(),
    subject: event.subject,
    eventType: event.eventType,
    eventTime: new Date(),
    data: event.data,
    dataVersion: event.dataVersion,
  };
  const client = new EventGridClient(
    new TopicCredentials(process.env.EVENTGRID_TOPIC_KEY!)
  );
  await client.publishEvents(process.env.EVENTGRID_TOPIC_ENDPOINT!, [
    loginAttemptEvent,
  ]);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const request = context.query.request;

  if (!request && context.res) {
    context.res.writeHead(302, {
      Location: "/.ory/kratos/public/self-service/browser/flows/login",
    });
    context.res.end();
  }

  const formFields = await generateFields(context);

  await sendEvent({
    subject: "anonymous",
    eventType: "frontend.login.attempt",
    data: { messages: formFields.messages?.map((msg) => msg.text) },
    dataVersion: "1",
  });

  return {
    props: {
      request,
      formFields,
    },
  };
};

const Login = ({
  request,
  formFields,
}: {
  request: string;
  formFields: FormConfig;
}) => {
  return (
    <>
      {formFields.messages?.map(({ text }) => {
        return (
          <>
            <div>{text}</div>
          </>
        );
      })}
      {request ? (
        <form action={formFields.action} method={formFields.method}>
          {formFields.fields.map(({ name, type, required, value }) => {
            return (
              <>
                <div>
                  {type !== "hidden" ? (
                    <label htmlFor={name}>{name}</label>
                  ) : null}
                  <input
                    id={name}
                    name={name}
                    type={type}
                    required={required}
                    defaultValue={value}
                  />
                </div>
              </>
            );
          })}
          <div>
            <input type="submit" value="Submit!" />
          </div>
        </form>
      ) : (
        <div>Nothing</div>
      )}
    </>
  );
};

export default Login;
