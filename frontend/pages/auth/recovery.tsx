import React from "react";
import { GetServerSideProps } from "next";
import { getRecoveryFields } from "../../lib/auth";
import { sendEvent } from "../../lib/events";
import { RequestMethodConfig } from "@oryd/kratos-client";

type RecoveryProps = {
  request: string;
  messages: string[] | null;
  formConfig: RequestMethodConfig;
};

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{ props: RecoveryProps }> => {
  const request = context.query.request;

  if (!request && context.res) {
    context.res.writeHead(302, {
      Location: "/.ory/kratos/public/self-service/browser/flows/recovery",
    });
    context.res.end();
    return { props: {} as any };
  }
  if (!request || Array.isArray(request)) {
    return { props: {} as any };
  }

  const recovery = await getRecoveryFields(request);
  console.log(JSON.stringify(recovery, null, 4));
  const formConfig = recovery.methods.link.config!;
  const messages = recovery.messages?.map((msg) => msg.text ?? "") ?? null;
  console.log(JSON.stringify(messages, null, 4));

  // TODO: This is just an example event. We need to figure out the schema for custom events and change this to events we really need.
  await sendEvent({
    subject: "frontend",
    eventType: "frontend.recovery.attempt",
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

const Recovery = ({ request, messages, formConfig }: RecoveryProps) => {
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

export default Recovery;
