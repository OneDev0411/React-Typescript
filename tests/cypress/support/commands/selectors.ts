import { getTestSelector } from 'helpers/page'

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      getByTestSelector: typeof getByTestSelector
    }
  }
}

Cypress.Commands.add('getByTestSelector', getByTestSelector)

function getByTestSelector(
  value: string | string[],
  options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
) {
  const selector = getTestSelector(value)

  return cy.get(selector, options)
}

export {}
