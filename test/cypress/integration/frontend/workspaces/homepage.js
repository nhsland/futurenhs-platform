let polyfill;
describe("Workspace Homepage", () => {
  before(() => {
    cy.login(
      Cypress.env("TEST_LOGIN_EMAIL_ADDRESS"),
      Cypress.env("TEST_LOGIN_PASSWORD")
    );
    cy.server({ force404: true });
    cy.route("POST", "https://dc.services.visualstudio.com/v2/track", {});
    const polyfillUrl = "https://unpkg.com/unfetch/dist/unfetch.umd.js";
    cy.request(polyfillUrl).then((response) => {
      polyfill = response.body;
    });
  });
  Cypress.on("window:before:load", (win) => {
    delete win.fetch;
    // since the application code does not ship with a polyfill
    // load a polyfilled "fetch" from the test
    win.eval(polyfill);
    win.fetch = win.unfetch;
    // Clear out session storage so that the disclaimer is always presented.
    win.sessionStorage.clear();
  });
  // const graphQlUrl = Cypress.env("GRAPHQL_URL");
  const mockWorkspaceResultForGraphQl = () => {
    cy.route2("/graphql", (req) => {
      req.reply({ fixture: "graphql-workspace.json" });
    });
  };
  it("Shows the title", () => {
    mockWorkspaceResultForGraphQl();
    cy.visit(`/workspaces/${Cypress.env("TEST_WORKSPACE_ID")}`);
    cy.contains("h1", "Selenium Testing");
    cy.contains("h2", "Most recent items");
  });
});
