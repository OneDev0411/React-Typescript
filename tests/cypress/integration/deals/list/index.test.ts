import { signin } from 'helpers/authentication'
import { getTestSelector, waitForPage } from 'helpers'

describe('Deals: List', () => {
  // https://docs.cypress.io/guides/references/best-practices.html#Having-tests-rely-on-the-state-of-previous-tests
  beforeEach(() => {
    signin()
    cy.visit('/dashboard/deals')
  })

  it('Should load deals list page', () => {
    cy.get(getTestSelector('deals-list')).should('have.length', 1)
  })

  it('Should open create deal page', () => {
    cy.get(getTestSelector('create-deal-button')).click()

    waitForPage('/deals/create')
  })
})
