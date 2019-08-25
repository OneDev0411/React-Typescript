declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      sandbox: typeof sandbox
      rollback: typeof rollback
    }
  }
}

Cypress.Commands.add('sandbox', sandbox)
Cypress.Commands.add('rollback', rollback)

/**
 * Sets x-suite header on each request. All db queries in requests with
 * the same x-suite header are executed in a single transaction which is
 * never committed. So we have suite level isolation.
 */
function sandbox() {
  cy.server({
    onAnyRequest: (route: any, proxy: any) => {
      proxy.xhr.setRequestHeader('x-suite', Cypress.spec.relative)
    }
  } as any)
}

// Rollback command rollsback current suite transaction to reset its state
function rollback() {
  cy.request(
    'POST',
    `http://localhost:3079/_/rollback?suite=${Cypress.spec.relative}`
  )
}

export {}
