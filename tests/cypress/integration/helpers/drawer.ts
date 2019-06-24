import { getTestSelector, waitForRemove } from './page'

export const waitForDrawerToClose = () => {
  waitForRemove(getTestSelector('open-drawer-overlay'))
}

export const submitDrawerForm = () => {
  cy.get(getTestSelector('open-drawer-content'))
    .get('button[type=submit]')
    .click()

  waitForDrawerToClose()
}
