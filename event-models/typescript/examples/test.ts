import { parse } from "..";

const data = `{"eventTime":"2020-01-01T01:00:00Z","id":"1","subject":"anonymous","eventType":"loggedin","dataVersion":"1","data":{"user":"IT WORKS"}}`;
const event = parse(data);
if (event.eventType === "loggedin" && event.dataVersion === "1") {
  console.log(event.data.user);
}
