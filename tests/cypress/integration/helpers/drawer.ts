import { setTextEditorData } from './fields'
import { getTestSelector } from './page'

export function submitDrawerForm() {
  return cy.getByTestSelector('open-drawer-content').within(() => {
    cy.get('button[type=submit]').click()
  })
}

// Fills email compose drawer inputs
// TODO: handle recipients field
export function fillEmailComposeDrawer(subject: string, content: string) {
  cy.getByTestSelector('email-subject').type(subject)
  setTextEditorData(content)
}

export function waitForDrawerToClose() {
  return cy.waitForRemove(getTestSelector('open-drawer-content'))
}
