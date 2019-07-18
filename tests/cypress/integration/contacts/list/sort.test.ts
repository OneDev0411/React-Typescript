import { changeSort } from 'helpers/grid'

import { addTask } from '../profile/helpers'

// https://gitlab.com/rechat/web/issues/2970
describe('Contacts list sort', () => {
  const contactId = '41310770-5aee-409a-b47a-97f6d2f16a91'

  beforeEach(() => {
    cy.viewport(1600, 800)
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/contacts')
  })

  it('Sorting by last touch should work properly after updating a contact last touch', () => {
    changeSort(1)

    cy.navigate(`/dashboard/contacts/${contactId}`)
    addTask('Test call')

    cy.navigate('/dashboard/contacts')

    cy.pageShouldContain('Last Touch was just now')
    cy.getByTestSelector('grid-row')
      .eq(0)
      .should('contain', 'Daniel Day-Lewis')
    cy.getByTestSelector('grid-row')
      .eq(1)
      .should('contain', 'Christine Lillian Akin')
  })
})
