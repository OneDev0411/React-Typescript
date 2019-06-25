declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      waitForRemove: typeof waitForRemove
      waitForPage: typeof waitForPage
    }
  }
}

Cypress.Commands.add('waitForRemove', waitForRemove)
Cypress.Commands.add('waitForPage', waitForPage)

function waitForRemove(selector: string, timeout: number = 10000) {
  return cy.get(selector, { timeout }).should('not.exist')
}

function waitForPage(url: string, timeout = 60000) {
  return cy.location('pathname', { timeout }).should('include', url)
}

export {}
