declare global {
  namespace Cypress {
    // @ts-ignore // all declarations of Chainable must have identical type parameters
    interface Chainable<Subject> {
      navigate: typeof navigate
    }
    // @ts-ignore
    interface Chainable<Window> {
      tgHistory: any
    }
  }
}

Cypress.Commands.add('navigate', navigate)

/**
 * Navigates to the provided route without reloading the page.
 * Cy.visit(...) reloads the page which is not suitable for some tests.
 *
 * @param route: the relative route to navigate to. E.g. '/dashboard/deals'
 *
 * This also depends on react router history to be exposed when running tests
 * with Cypress.
 */
function navigate(route: string) {
  return cy
    .window()
    .its('__history')
    .invoke('push', route)
}

export {}
