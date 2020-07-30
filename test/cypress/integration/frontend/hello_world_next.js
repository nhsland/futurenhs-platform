describe("Hello world", () => {
  it("Visits the home page", () => {
    cy.visit("/");
    var baseUrl = Cypress.config().baseUrl;
    cy.url().should("include", baseUrl);
  });

  it("Renders page elements", () => {
    cy.get("section").should("contain", "FutureNHS");
  });
});
