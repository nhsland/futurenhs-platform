describe("Deleting a file", () => {
  it("Click through to file page", () => {
    const start = `/workspaces/750a5fb7-47da-4a8c-8d2e-399ae8d24cde/folders/63c7f15a-7077-4b46-8808-99227ad06c8f/files/a5754830-ce41-43d9-b911-d8cfcca7f6ae`;
    // const start = `/workspaces/directory`;
    cy.visit(start);
    cy.contains("h1", "South East Region Safeguarding Annual Report");
    cy.get("[aria-label=Options]").click();
  });
});
