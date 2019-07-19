import { acceptConfirmationModal } from 'helpers/modal'

import { expandShowMoreLess, getTestSelector } from 'helpers/page'

describe('Contacts page, tags', () => {
  beforeEach(() => {
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/contacts')
  })

  it('Removed tags are not shown in the contacts page', () => {
    cy.navigate('/dashboard/account/manage-tags')

    cy.get(`${getTestSelector('tag-item-Agent')} button`).click()

    acceptConfirmationModal()

    cy.navigate('/dashboard/contacts')

    expandShowMoreLess('lists-list')

    cy.getByTestSelector('tag-item-Agent').should('not.exist')

  })
})
