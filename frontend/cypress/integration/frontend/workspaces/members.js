describe("Workspace Members page", () => {
  it("Shows the title", () => {
    cy.visit(`/workspaces/${Cypress.env("TEST_WORKSPACE_ID")}`);
    cy.contains("h1", "Selenium Testing");

    cy.get("a").contains("View members").click();
    cy.contains("h1", "Workspace members");
    cy.contains("p", "This is a list of all workspace members.");
  });
});
