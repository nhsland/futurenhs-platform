import { parse, stringify } from ".";

it("serializes", () => {
  const result = stringify({
    id: "id",
    subject: "subj",
    eventTime: "2020-09-09T10:22:42.235679+00:00",
    eventType: "loggedin",
    dataVersion: "1",
    data: {
      user: "user",
    },
  });
  expect(result).toEqual(
    '{"id":"id","subject":"subj","eventTime":"2020-09-09T10:22:42.235679+00:00","eventType":"loggedin","dataVersion":"1","data":{"user":"user"}}'
  );
});

it("deserializes", () => {
  const result = parse(
    '{"id":"id","subject":"subj","eventTime":"2020-09-09T10:22:42.235679+00:00","eventType":"loggedin","dataVersion":"1","data":{"user":"user"}}'
  );
  expect(result).toEqual({
    id: "id",
    subject: "subj",
    eventTime: "2020-09-09T10:22:42.235679+00:00",
    eventType: "loggedin",
    dataVersion: "1",
    data: {
      user: "user",
    },
  });
});
