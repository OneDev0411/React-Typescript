describe('Flows grid, get brand flows', () => {
  beforeEach(() => {
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/marketing/flows')
  })

  it('Should have some flows', () => {
    cy.wait(2000)

    cy.getByTestSelector('grid-row', { timeout: 100 }).should(
      ($els: NodeList): void => {
        expect($els.length).to.be.at.least(1)
      }
    )
  })
})
