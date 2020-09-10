describe("Login", () => {
  it("Visits the home page", () => {
    cy.login("EMAIL", "PASSWORD");

    cy.visit("/workspaces/private");
    cy.contains("h1", "Private Page");
  });
});
