import React from "react";
import { GetServerSideProps } from "next";
import { getSettingsFields } from "../../lib/auth";
import { sendEvent } from "../../lib/events";
import { RequestMethodConfig } from "@oryd/kratos-client";

type SettingsProps = {
  request: string;
  messages: string[] | null;
  formConfig: RequestMethodConfig;
};

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: SettingsProps }> => {
  const request = context.query.request;

  if (!request && context.res) {
    context.res.writeHead(302, {
      Location: "/.ory/kratos/public/self-service/browser/flows/settings",
    });
    context.res.end();
    return { props: {} as any };
  }
  if (!request || Array.isArray(request)) {
    return { props: {} as any };
  }

  const settings = await getSettingsFields(request);
  console.log(JSON.stringify(settings, null, 4));
  const formConfig = settings.methods.password.config!;
  const messages = settings.messages?.map((msg) => msg.text ?? "") ?? null;
  console.log(JSON.stringify(messages, null, 4));

  // TODO: This is just an example event. We need to figure out the schema for custom events and change this to events we really need.
  await sendEvent({
    subject: "frontend",
    eventType: "frontend.settings.attempt",
    data: { messages },
    dataVersion: "1",
  });

  return {
    props: {
      request,
      messages,
      formConfig,
    },
  };
};

const Settings = ({ request, messages, formConfig }: SettingsProps) => {
  return (
    <>
      {messages?.map((text, i) => {
        return <div key={i}>{text}</div>;
      })}
      {request ? (
        <form action={formConfig.action} method={formConfig.method}>
          {formConfig.fields.map(({ name, type, required, value }, i) => (
            <div key={i}>
              {type !== "hidden" ? <label htmlFor={name}>{name}</label> : null}
              <input
                id={name}
                name={name}
                type={type}
                required={required}
                defaultValue={(value as unknown) as string}
              />
            </div>
          ))}
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

export default Settings;
