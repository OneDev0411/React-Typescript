import { changeSort } from 'helpers/grid'

import { addTask } from '../profile/helpers'

// https://gitlab.com/rechat/web/issues/2970
describe('Contacts list sort', () => {
  beforeEach(() => {
    cy.viewport(1600, 800)
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/contacts')
  })

  it('Sorting by last touch should work properly after updating a contact last touch', () => {
    changeSort(1)

    const contactId = '507b7b8a-769f-4ebf-b5fa-2390c7dfb3f9'
    const contactName = 'Mauro Camoranesi'
    const secondContactName = 'Daniele De Rossi'

    cy.navigate(`/dashboard/contacts/${contactId}`)
    addTask('Test call')

    cy.navigate('/dashboard/contacts')

    cy.getByTestSelector('grid-row')
      .eq(0)
      .should('contain', contactName)
    cy.getByTestSelector('grid-row')
      .eq(1)
      .should('contain', secondContactName)
  })
})
