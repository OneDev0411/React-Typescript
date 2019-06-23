import { waitForRemove } from '.'

export const acceptConfirmationModal = () => {
  cy.get('confirmation-modal-confirm-button').click()
}

export const cancelConfirmationModal = () => {
  cy.get('confirmation-modal-cancel-button').click()
}

export const waitForModalToClose = () => {
  waitForRemove('.ReactModal__Overlay')
}
