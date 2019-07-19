declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      navigate: typeof navigate
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
 *
 * https://github.com/cypress-io/cypress/issues/128
 * https://github.com/cypress-io/cypress/issues/3120#issuecomment-453254393
 */
function navigate(route: string) {
  return (
    cy
      .window()
      // @ts-ignore
      .its('__history')
      .invoke('push', route)
  )
}

export {}
