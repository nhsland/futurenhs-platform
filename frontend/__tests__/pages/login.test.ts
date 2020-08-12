import { ServerResponse } from "http";
import { GetServerSidePropsContext } from "next";
import { LoginRequest } from "@oryd/kratos-client";
import { getServerSideProps } from "../../pages/auth/login";
import { adminApi } from "../../utils/kratos";
import { kratosRequestBase } from "../../lib/test-helpers/fixtures";

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

  const body: LoginRequest = {
    ...kratosRequestBase,
    methods: {
      password: {
        config: formConfig,
        method: "password",
      },
    },
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
      Location: "/.ory/kratos/public/self-service/browser/flows/login",
    });
    expect(context.res.end).toHaveBeenCalled();
  });

  test("with request id", async () => {
    mockedAdminApi.getSelfServiceBrowserLoginRequest.mockResolvedValue({
      response: null as any,
      body: body,
    });

    const props = await getServerSideProps(context);

    expect(props).toEqual({
      props: {
        request: requestValue,
        formConfig: formConfig,
      },
    });
  });

  test("throws error", async () => {
    mockedAdminApi.getSelfServiceBrowserLoginRequest.mockRejectedValue({
      body: { messages: "something went wrong" },
    });

    const result = await getServerSideProps(context).catch((e) => e);

    expect(result).toEqual({
      body: { messages: "something went wrong" },
    });
  });
});
