describe("Hello world", () => {
  it("Visits the home page", () => {
    cy.visit("/");
    const baseUrl = Cypress.config().baseUrl;
    cy.url().should("include", baseUrl);
  });

  it("Renders page elements", () => {
    cy.get("p").should("contain", "The new Future is coming..");
  });
});
