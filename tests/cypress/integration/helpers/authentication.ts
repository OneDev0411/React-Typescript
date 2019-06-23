const email = Cypress.env('E2E_EMAIL')
const password = Cypress.env('E2E_PASSWORD')

import { getTestSelector, waitForPage } from '.'

export function signin() {
  cy.visit('/signin')

  cy.get('#username').type(email)
  cy.get('#password').type(password)
  cy.get('form').submit()

  waitForPage('/dashboard')
}

export function signout() {
  cy.get(getTestSelector('settings-dropdown-button')).click()
  cy.get('[href="/signout"]').click()

  waitForPage('/signin')
}
