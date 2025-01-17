describe('Test Spec', () => {
  it('test', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('https://stage-semi--hdfc-bank--aemsites.hlx.live/content/forms/af/hdfc_haf/cards/semi/forms/semi');
    cy.get('.field-aem-mobilenum > .field-label').click();
    cy.get('#textinput-9788d1ff27').clear('9818138473');
    cy.get('#textinput-9788d1ff27').type('9818138473');
    cy.get('.field-aem-cardno > .field-label').click();
    cy.get('#textinput-7929b3478a').clear('5300');
    cy.get('#textinput-7929b3478a').type('5300');
    cy.get('#button-2024db0da1').click();
    /* ==== End Cypress Studio ==== */
  });
});