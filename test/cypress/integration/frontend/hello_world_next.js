describe("Hello world", () => {
  it("Visits the home page", () => {
    cy.visit("/");
    var baseUrl = Cypress.config().baseUrl;
    console.log(baseUrl);
    // cy.url().should("include", "http://bs-local.com:3000");
    cy.url().should("include", baseUrl);
  });

  it("Renders page elements", () => {
    cy.get("section").should("contain", "FutureNHS");
  });
});
