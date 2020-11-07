describe("Workspace Directory", () => {
  // Currently only works against Prod or if you manually create a Workspace named "Selenium Testing" in your local/dev cluster environment
  it("Shows title and loads directory items", () => {
    cy.visit(`/workspaces/directory`);
    cy.contains("h1", "My workspaces");
    cy.contains("div", Cypress.env("TEST_WORKSPACE_NAME"));
  });

  it("Navigates to workspace page", () => {
    cy.visit(`/workspaces/directory`);

    cy.get("div").contains(Cypress.env("TEST_WORKSPACE_NAME")).click();
    cy.location("pathname", {
      timeout: Cypress.config("pageLoadTimeout"),
    }).should("eq", `/workspaces/${Cypress.env("TEST_WORKSPACE_ID")}`);
    cy.contains("h1", Cypress.env("TEST_WORKSPACE_NAME"));
    cy.contains("h2", "Most recent items");
  });
});
