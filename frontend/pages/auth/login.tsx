import React from "react";
import { GetServerSideProps } from "next";
import { generateFields, FormConfig } from "../../lib/login";
import { sendEvent } from "../../lib/events";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const request = context.query.request;

  if (!request && context.res) {
    context.res.writeHead(302, {
      Location: "/.ory/kratos/public/self-service/browser/flows/login",
    });
    context.res.end();
    return { props: {} };
  }

  const formFields = await generateFields(context);

  // FIXME: This is just an example event. We need to figure out the schema for custom events and change this to events we really need.
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
