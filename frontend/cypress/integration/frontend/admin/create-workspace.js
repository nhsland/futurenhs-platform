describe("Workspace Directory", () => {
  it("Shows title, renders form and submits", () => {
    cy.visit(`/admin/create-workspace`);
    cy.contains("h1", "Create a workspace");

    cy.get("#title").type("New File title");
    cy.get("#description").type("New File description");
    cy.get("form").submit();
  });

  it("Should render a title error when submitted with no title", () => {
    cy.visit(`/admin/create-workspace`);
    cy.get("#description").type("New File description");
    cy.get("form").submit();
    cy.contains(".nhsuk-error-message", "Title is required");
  });
});
