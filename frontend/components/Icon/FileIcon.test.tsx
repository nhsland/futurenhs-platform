import { matches } from "./FileIcon";

describe(matches, () => {
  test("application/pdf matches pdf", () => {
    expect(matches("application/pdf", "pdf")).toBeTruthy();
  });

  test("application/pdf does not match img", () => {
    expect(matches("application/pdf", "img")).toBeFalsy();
  });

  test("image/anything matches img", () => {
    expect(matches("image/png", "img")).toBeTruthy();
  });
});
