import { getTestSelector } from 'helpers/page'
import { acceptConfirmationModal } from 'helpers/modal'

export function deleteList(
  listName: string
): ReturnType<typeof cy.waitForRemove> {
  const listSelector = getTestSelector(`contact-list-${listName}`)

  cy.get(listSelector).scrollIntoView()

  const deleteListSelector = `${listSelector} ${getTestSelector('delete-list')}`

  cy.get(deleteListSelector).click({ force: true }) // cypress doesn't support hover!

  acceptConfirmationModal()

  return cy.waitForRemove(listSelector)
}
