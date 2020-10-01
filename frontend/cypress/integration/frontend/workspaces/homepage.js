describe("Workspace Homepage", () => {
  it("Shows the title", () => {
    cy.visit(`/workspaces/${Cypress.env("TEST_WORKSPACE_ID")}`);
    cy.contains("h1", "Selenium Testing");
    cy.contains("h2", "Most recent items");
  });
});
