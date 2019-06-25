export function acceptConfirmationModal() {
  return cy.getByTestSelector('confirmation-modal-confirm-button').click()
}

export function cancelConfirmationModal() {
  return cy.getByTestSelector('confirmation-modal-cancel-button').click()
}

export function waitForModalToClose() {
  return cy.waitForRemove('.ReactModal__Overlay')
}
