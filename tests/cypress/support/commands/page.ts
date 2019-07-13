declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      waitForRemove: typeof waitForRemove
      waitForPage: typeof waitForPage
      pageShouldContain: typeof pageShouldContain
    }
  }
}

Cypress.Commands.add('waitForRemove', waitForRemove)
Cypress.Commands.add('waitForPage', waitForPage)
Cypress.Commands.add('pageShouldContain', pageShouldContain)

function waitForRemove(selector: string, timeout: number = 10000) {
  return cy.get(selector, { timeout }).should('not.exist')
}

function waitForPage(url: string | RegExp, timeout = 60000) {
  if (url instanceof RegExp) {
    return cy.location('pathname', { timeout }).should('match', url)
  }

  return cy.location('pathname', { timeout }).should('include', url)
}

function pageShouldContain(text: string, timeout = 10000) {
  return cy.get('body', { timeout }).contains(text)
}

export {}
