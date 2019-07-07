export function acceptConfirmationModal() {
  return cy.getByTestIdSelector('confirmation-modal-confirm-button').click()
}

export function cancelConfirmationModal() {
  return cy.getByTestIdSelector('confirmation-modal-cancel-button').click()
}

export function waitForModalToClose() {
  return cy.waitForRemove('.ReactModal__Overlay')
}
