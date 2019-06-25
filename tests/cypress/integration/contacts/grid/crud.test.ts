import { createContact, selectGridRow, deleteContact } from './helpers'

describe('contacts page', () => {
  beforeEach(() => {
    cy.signin()
    cy.visit('/dashboard/contacts')
  })

  it('User can create contact', () => {
    createContact({ firstName: 'Paul', lastName: 'Scholes' })
  })

  it('User can remove a selected contact and selection should correctly get updated', () => {
    cy.getByTestSelector('table-summary')
      .invoke('text')
      .should('not.contain', 'of')

    selectGridRow()
    cy.getByTestSelector('table-summary')
      .invoke('text')
      .should('contain', 'of')

    deleteContact()
    cy.getByTestSelector('table-summary')
      .invoke('text')
      .should('not.contain', 'of')
  })
})
