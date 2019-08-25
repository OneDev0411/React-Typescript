describe('Contacts list, flows list', () => {
  beforeEach(() => {
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/contacts')
  })

  it('Should select item 4th from the list and the item should inserted as a filter into grid', () => {
    cy.getByTestSelector('flow-item', { timeout: 2000 })
      .children().eq(3).click()

    cy.getByTestSelector('filter-item')
      .contains('Referral Follow-up').should('be.visible')
  })
})
