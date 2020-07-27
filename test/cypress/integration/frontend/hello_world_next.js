describe("Hello world", () => {
  it("Visits the home page", () => {
    cy.visit("/");
    cy.url().should("include", "http://bs-local.com:3000");
  });

  it("Renders page elements", () => {
    cy.get("section").should("contain", "FutureNHS");
  });
});
