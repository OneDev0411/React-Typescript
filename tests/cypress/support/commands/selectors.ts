import { getTestSelector } from 'helpers/page'

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      getByTestSelector: typeof getByTestSelector
    }
  }
}

Cypress.Commands.add('getByTestSelector', getByTestSelector)

function getByTestSelector(value: string | string[]) {
  const selector = getTestSelector(value)

  return cy.get(selector)
}

export {}
