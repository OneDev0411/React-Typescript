export function acceptConfirmationModal(): ReturnType<
  typeof cy.getByTestSelector
> {
  return cy.getByTestSelector('confirmation-modal-confirm-button').click()
}

export function cancelConfirmationModal(): ReturnType<
  typeof cy.getByTestSelector
> {
  return cy.getByTestSelector('confirmation-modal-cancel-button').click()
}

export function waitForModalToClose(): ReturnType<typeof cy.waitForRemove> {
  return cy.waitForRemove('.ReactModal__Overlay')
}
