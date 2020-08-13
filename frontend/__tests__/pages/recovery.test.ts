import { ServerResponse } from "http";
import { GetServerSidePropsContext } from "next";
import { RecoveryRequest } from "@oryd/kratos-client";
import { getServerSideProps } from "../../pages/auth/recovery";
import { adminApi } from "../../utils/kratos";
import { kratosRequestBase } from "../../lib/test-helpers/fixtures";

jest.mock("../../lib/events");
jest.mock("../../utils/kratos");

const mockedAdminApi = adminApi as jest.Mocked<typeof adminApi>;

describe("getServerSideProps", () => {
  const formConfig = {
    action: "http://url.com",
    fields: [
      { name: "email", type: "text" },
      {
        name: "csrf_token",
        type: "hidden",
      },
    ],
    method: "post",
  };

  const body: RecoveryRequest = {
    ...kratosRequestBase,
    state: "SOMESTATE",
    methods: {
      link: {
        config: formConfig,
        method: "link",
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
      Location: "/.ory/kratos/public/self-service/browser/flows/recovery",
    });
    expect(context.res.end).toHaveBeenCalled();
  });

  test("with request id and messages", async () => {
    mockedAdminApi.getSelfServiceBrowserRecoveryRequest.mockResolvedValue({
      response: null as any,
      body: {
        ...body,
        messages: [{ text: "success! Please enter your email address" }],
      },
    });

    const props = await getServerSideProps(context);

    expect(props).toEqual({
      props: {
        request: requestValue,
        messages: ["success! Please enter your email address"],
        formConfig: formConfig,
      },
    });
  });

  test("throws error", async () => {
    mockedAdminApi.getSelfServiceBrowserRecoveryRequest.mockRejectedValue({
      body: { messages: "something went wrong" },
    });

    const result = await getServerSideProps(context).catch((e) => e);

    expect(result).toEqual({
      body: { messages: "something went wrong" },
    });
  });
});
