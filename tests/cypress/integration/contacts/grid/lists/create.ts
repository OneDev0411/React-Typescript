import { waitForModalToClose } from 'helpers/modal'

import { addOpenHouseFilter } from '../../helpers'

export function createList(listName: string) {
  addOpenHouseFilter()

  cy.getByTestSelector('save-list-button').click()

  cy.getByTestSelector('new-list-name-input')
    .click()
    .type(listName)

  cy.getByTestSelector('save-list-button-modal').click()

  waitForModalToClose()

  return cy.getByTestSelector(`contact-list-${listName}`).should('exist')
}
