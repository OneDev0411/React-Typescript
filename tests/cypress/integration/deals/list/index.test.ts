describe('Deals list', () => {
  beforeEach(() => {
    cy.signin()
    cy.visit('/dashboard/deals')
  })

  it('Should load deals list page', () => {
    cy.getByTestSelector('deals-list').should('have.length', 1)
  })

  it('Should open create deal page', () => {
    cy.getByTestSelector('create-deal-button').click()
    cy.waitForPage('/deals/create')
  })
})
