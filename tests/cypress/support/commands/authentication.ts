declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      signin: typeof signin
      signout: typeof signout
    }
  }
}

Cypress.Commands.add('signin', signin)
Cypress.Commands.add('signout', signout)

function signin(
  email: string = Cypress.env('E2E_EMAIL'),
  password: string = Cypress.env('E2E_PASSWORD')
) {
  cy.visit('/signin')

  cy.get('#username').type(email)
  cy.get('#password').type(password)
  cy.get('form').submit()

  return cy.waitForPage('/dashboard')
}

function signout() {
  cy.getByTestSelector('settings-dropdown-button').click()
  cy.get('[href="/signout"]').click()

  return cy.waitForPage('/signin')
}

export {}
