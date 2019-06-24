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

function waitForRemove(selector: string, timeout: number = 5000, interval: number = 500): ReturnType<typeof cy.waitUntil> {
  return cy.waitUntil(() => Cypress.$(selector).length === 0, {
    timeout,
    interval
  })
}

function waitForPage(url: string, timeout = 60000): ReturnType<typeof cy.location> {
  return cy.location('pathname', { timeout }).should('include', url)
}

export { }
