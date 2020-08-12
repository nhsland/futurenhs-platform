import { ServerResponse } from "http";
import { GetServerSidePropsContext } from "next";
import { SettingsRequest } from "@oryd/kratos-client";
import { getServerSideProps } from "../../pages/auth/settings";
import { adminApi } from "../../utils/kratos";

jest.mock("../../lib/events");
jest.mock("../../utils/kratos");

const mockedAdminApi = adminApi as jest.Mocked<typeof adminApi>;

describe("getServerSideProps", () => {
  const formConfig = {
    action: "http://url.com",
    fields: [
      { name: "identifier", type: "text" },
      { name: "password", type: "password" },
      {
        name: "csrf_token",
        type: "hidden",
      },
    ],
    method: "post",
  };

  const body: SettingsRequest = {
    identity: {
      id: "63cd5eff-7ce1-463c-9c5a-8886dc8fd3ba",
      schemaId: "default",
      traits: {},
    },
    state: "erm...",
    active: "password",
    expiresAt: new Date(),
    id: "598a45d2-e107-41ba-885a-c5c39e4a26d5",
    issuedAt: new Date(),
    messages: undefined,
    methods: {
      password: {
        config: formConfig,
        method: "password",
      },
    },
    requestUrl: "http://localhost:4455/self-service/browser/flows/settings",
  };

  const requestValue = "test123";

  const context: GetServerSidePropsContext = ({
    query: {
      request: requestValue,
    },
    res: ({
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown) as ServerResponse,
  } as unknown) as GetServerSidePropsContext;

  test("redirects when there is no request id", async () => {
    await getServerSideProps({ ...context, query: {} });

    expect(context.res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/.ory/kratos/public/self-service/browser/flows/settings",
    });
    expect(context.res.end).toHaveBeenCalled();
  });

  test("with request id ", async () => {
    mockedAdminApi.getSelfServiceBrowserSettingsRequest.mockResolvedValue({
      response: null as any,
      body: body,
    });

    const props = await getServerSideProps(context);

    expect(props).toEqual({
      props: {
        request: requestValue,
        messages: null,
        formConfig: formConfig,
      },
    });
  });

  test("throws error", async () => {
    mockedAdminApi.getSelfServiceBrowserSettingsRequest.mockRejectedValue({
      body: { messages: "something went wrong" },
    });

    const result = await getServerSideProps(context).catch((e) => e);

    expect(result).toEqual({
      body: { messages: "something went wrong" },
    });
  });
});
