export const acceptConfirmationModal = () => {
  cy.getByTestSelector('confirmation-modal-confirm-button').click()
}

export const cancelConfirmationModal = () => {
  cy.getByTestSelector('confirmation-modal-cancel-button').click()
}

export const waitForModalToClose = () => {
  cy.waitForRemove('.ReactModal__Overlay')
}
