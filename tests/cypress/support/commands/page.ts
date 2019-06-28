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

function waitForPage(url: string | RegExp, timeout = 60000) {
  if (url instanceof RegExp) {
    return cy.location('pathname', { timeout }).should('match', url)
  }

  return cy.location('pathname', { timeout }).should('include', url)
}

export {}
