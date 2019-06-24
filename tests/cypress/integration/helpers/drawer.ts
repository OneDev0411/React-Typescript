import { getTestSelector } from './page'

export const waitForDrawerToClose = () => {
  cy.waitForRemove(getTestSelector('open-drawer-overlay'))
}

export const submitDrawerForm = () => {
  cy.getByTestSelector('open-drawer-content')
    .get('button[type=submit]')
    .click()

  waitForDrawerToClose()
}
