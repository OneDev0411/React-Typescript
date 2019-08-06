import { setTextEditorData } from './fields'
import { getTestSelector } from './page'

export function submitDrawerForm(level = 1) {
  return cy.getByTestSelector(`drawer-${level}`).within(() => {
    cy.get('button[type=submit]').click()
  })
}

// Fills email compose drawer inputs
// TODO: handle recipients field
export function fillEmailComposeDrawer(subject: string, content: string) {
  cy.getByTestSelector('email-subject').type(subject)
  setTextEditorData(content)
}

export function waitForDrawerToClose(level = 1) {
  return cy.waitForRemove(getTestSelector(`drawer-${level}`))
}
