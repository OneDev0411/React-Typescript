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

function waitForRemove(selector: string, timeout: number = 5000, interval: number = 500) {
  let remainingTimeout = timeout

  while (remainingTimeout >= 0) {
    try {
      cy.get(selector).should('not.exist')
    } catch (err) {
      if (remainingTimeout < 0) {
        throw err
      }

      cy.wait(interval)
    }
  }

  throw new Error(`${selector} still exists`)
}

function waitForPage(url: string, timeout = 60000): ReturnType<typeof cy.location> {
  return cy.location('pathname', { timeout }).should('include', url)
}

export { }
