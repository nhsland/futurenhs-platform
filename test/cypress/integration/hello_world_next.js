describe("Hello world", () => {
  it("Visits the home page", () => {
    cy.visit("http://bs-local.com:3000");
  });

  it("Renders page elements", () => {
    cy.get("h1").should("contain", "[Your Name]");
    cy.get("main").should("contain", "FutureNHS");
  });
});
