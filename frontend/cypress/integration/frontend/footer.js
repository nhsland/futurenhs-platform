describe("Footer", () => {
  it("displays footer correctly", () => {
    cy.visit(`/workspaces/directory`);
    cy.get(".nhsuk-footer__list-item-link")
      .should("contain", "About")
      .and("contain", "Terms and Conditions")
      .and("contain", "Accessibility Statement")
      .and("contain", "Privacy Policy");

    cy.get(".nhsuk-footer__copyright").contains(
      "© All content is available under the Open Government Licence v3.0, except where otherwise stated."
    );
  });
});
