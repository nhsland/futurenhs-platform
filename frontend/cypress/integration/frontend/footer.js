describe("Footer", () => {
  it("displays footer correctly", () => {
    cy.visit(`/workspaces/directory`);
    cy.get(".nhsuk-footer__list-item-link")
      .should("contain", "About")
      .and("contain", "Terms and Conditions")
      .and("contain", "Accessibility Statement")
      .and("contain", "Privacy Policy");

    cy.get(".nhsuk-footer__copyright").should("contain", "© Crown copyright");
    cy.get('[data-cy="license"]')
      .should("have.attr", "href")
      .and(
        "contain",
        "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
      );
  });
});
