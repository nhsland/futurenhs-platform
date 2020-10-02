describe("Nav Menu", () => {
  before(() => {
    cy.login(
      Cypress.env("TEST_LOGIN_EMAIL_ADDRESS"),
      Cypress.env("TEST_LOGIN_PASSWORD")
    );
    cy.server({ force404: true });
    cy.route("POST", "https://dc.services.visualstudio.com/v2/track", {});
    cy.visit(`/workspaces/directory`);
  });

  context("Desktop - 990px+", () => {
    beforeEach(() => {
      cy.viewport(1200, 1200);
    });

    it("displays header correctly", () => {
      cy.get(".fnhs-logo").should("be.visible");
      cy.get(".nhsuk-logo").should("be.visible");
      cy.get(".nav-bar-item").should("be.visible");
      cy.get(".desktop-nav-menu").should("be.visible");

      cy.get(".mobile-nav-menu").should("not.be.visible");
    });

    it("menu can be opened/closed", () => {
      cy.get(".desktop-nav-menu")
        .click()
        .then(($menu) => {
          cy.get("nav").should("be.visible");
          cy.get(".mobileOnly").should("not.be.visible");
        });
      cy.get(".desktop-nav-menu")
        .click()
        .then(() => {
          cy.get("nav").should("not.be.visible");
        });
    });

    it("'My workspaces' link navigates to workspaces directory", () => {
      cy.visit("/admin/create-workspace/");
      cy.get(".nav-bar-item").click();
      cy.contains("h1", "My workspaces");
    });
  });

  context("Mobile - 320px", () => {
    beforeEach(() => {
      cy.viewport(320, 720);
    });

    it("displays header correctly", () => {
      cy.get(".fnhs-logo").should("be.visible");
      cy.get(".mobile-nav-menu").should("be.visible");

      cy.get(".nhsuk-logo").should("not.be.visible");
      cy.get(".nav-bar-item").should("not.be.visible");
      cy.get(".desktop-nav-menu").should("not.be.visible");
    });

    it("menu can be opened/closed", () => {
      cy.get(".mobile-nav-menu")
        .click()
        .then(() => {
          cy.get("nav").should("be.visible");
        });
      cy.get(".nhsuk-icon__close")
        .click()
        .then(() => {
          cy.get("nav").should("not.be.visible");
        });
    });

    it("'My workspaces' nav list item navigates to workspaces directory", () => {
      cy.visit("/admin/create-workspace/");
      cy.get(".mobile-nav-menu")
        .click()
        .then(() => {
          cy.get(".mobileOnly").click();
        });
      cy.contains("h1", "My workspaces");
    });
  });
});
