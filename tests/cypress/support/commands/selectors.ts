import { getTestSelector, getTestIdSelector } from 'helpers/page'

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      getByTestSelector: typeof getByTestSelector
      getByTestIdSelector: typeof getByTestIdSelector
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

function getByTestIdSelector(
  value: string | string[],
  options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
) {
  const selector = getTestIdSelector(value)

  return cy.get(selector, options)
}

export {}
