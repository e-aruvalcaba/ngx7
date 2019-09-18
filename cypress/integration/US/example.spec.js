describe('Example test spec', function() {
  it('starts the application', function() {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
  });
  it('login headless', function() {
    cy.login('customer.service.us@cemexlabs.com', 'Customer$ervice');
    cy.visit('http://localhost:4200/app');
  });
  it('should open contact dialog', function() {
    cy.get('#cmx-header-country-support-button').contains('Contact us');
    cy.get('#cmx-header-country-support-button').click({ force: true });
  });
  it('should have opened dialog', function() {
    cy.get('.cmx-dialog-title').should('have.class', 'cmx-dialog-title');
    cy.get('.cmx-dialog-title').click({ force: true });
  });
  it('should close contact dialog', function() {
    cy.get(
      '[templateid="cmx-header-country-support-contact-modal"] > .cmx-dialog__container > .cmx-dialog__container__close-button > .cmx-icon-close'
    ).should('have.class', 'cmx-icon-close');
    cy.get(
      '[templateid="cmx-header-country-support-contact-modal"] > .cmx-dialog__container > .cmx-dialog__container__close-button > .cmx-icon-close'
    ).click({ force: true });
  });
  it('should logout', function() {
    cy.get('#cmx-header-logout-link').should('have.class', 'cmx-user-menu__sign-out-link');
    cy.get('#cmx-header-logout-link').should('have.class', 'cmx-button');
    cy.get('#cmx-header-logout-link').should('have.class', 'cmx-button--link');
    cy.get('#cmx-header-logout-link').click({ force: true });
  });
});
