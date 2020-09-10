describe("Login", () => {
  it("Visits the home page", () => {
    cy.login(
      Cypress.env("TEST_LOGIN_EMAIL_ADDRESS"),
      Cypress.env("TEST_LOGIN_PASSWORD")
    );

    cy.visit("/workspaces/private");
    cy.contains("h1", "Private Page");
  });
});
