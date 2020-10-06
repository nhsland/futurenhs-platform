describe("Upload single file", () => {
  it.skip("Shows title, renders form and submits", () => {
    cy.visit(
      `/workspaces/01bb9a4d-2977-4c43-b28c-2a72b4eda453/folders/d1275f92-bf97-428f-a4ce-b2cac0cc3513/upload-file`
    );
    cy.contains("h1", "FutureNHS Case Study Library");

    cy.get("#title").type("New file title");
    cy.get("#files").attachFile("single-file-upload.txt");

    cy.get("form").submit();

    // for now we cannot intercept external calls
    // and the blobName is in the host part of the URL
    // so we have to stop here
    cy.contains(
      "Unable to extract blobName and containerName with provided information."
    );
  });

  it.skip("Shows title, form and press discard to go back to previous page ", () => {
    const start = `/workspaces/01bb9a4d-2977-4c43-b28c-2a72b4eda453/folders/d1275f92-bf97-428f-a4ce-b2cac0cc3513`;
    cy.visit(start);

    cy.get('*[class^="FolderMenuButton"]').click();
    cy.get("a").contains("Upload file").click();

    cy.contains("h1", "FutureNHS Case Study Library");

    cy.get("button.nhsuk-button--secondary").contains("Discard").click();
    cy.location("pathname").should("eq", start);
  });
});
