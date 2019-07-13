import { createContact, selectGridRow, deleteContact } from './helpers'

describe('Contacts grid', () => {
  beforeEach(() => {
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/contacts')
  })

  it('User can create contact', () => {
    createContact({ firstName: 'Paul', lastName: 'Scholes' })
    cy.visit('/dashboard/contacts')
    cy.pageShouldContain('Paul Scholes')
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
