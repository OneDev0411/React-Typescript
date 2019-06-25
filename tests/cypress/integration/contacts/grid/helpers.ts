import { submitDrawerForm } from 'helpers/drawer'
import { getTestSelector } from 'helpers/page'
import { acceptConfirmationModal } from 'helpers/modal'

interface ContactData {
  title?: string
  firstName?: string
  lastName?: string
  // We can add items to this list whenever it's required
}

export function createContact({
  title = 'Mr.',
  firstName = '',
  lastName = ''
}: ContactData = {}) {
  cy.getByTestSelector('create-contact-button').click()
  cy.getByTestSelector('title-select').click()
  cy.getByTestSelector(`title-select-option-${title}`).click()
  cy.getByTestSelector('text-field-first_name').type(firstName)
  cy.getByTestSelector('text-field-last_name').type(lastName)

  return submitDrawerForm()
}

export function selectGridRow(index: number = 0) {
  return cy
    .get([getGridRowSelector(index), getTestSelector('checkbox')].join(' '))
    .click()
}

export function deleteContact(index = 0) {
  cy.get(
    [getGridRowSelector(index), getTestSelector('contact-menu')].join(' ')
  ).click()
  cy.getByTestSelector('contact-row-delete-action')
    .eq(index)
    .click()

  return acceptConfirmationModal()
}

function getGridRowSelector(index: number): string {
  return `${getTestSelector('grid-row')}:nth-child(${index + 1})`
}
