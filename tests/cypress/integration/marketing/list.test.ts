import { chooseListing } from 'helpers/listing-drawer'

import { skipOnBoarding, customizeTemplate } from './helpers'

describe('Marketing center editor', () => {
  beforeEach(() => {
    cy.signin()
  })

  it('User should be able to see home page and templates list', () => {
    cy.visit('/dashboard/marketing')
    skipOnBoarding()
    cy.waitForPage('/dashboard/marketing')
    cy.visit('/dashboard/marketing/JustListed/Email')
    cy.waitForPage('/dashboard/marketing/JustListed/Email')
    cy.getByTestSelector('marketing-template').should('have.length.gt', 0)
  })

  it('User should be able to customize templates and select a listing', () => {
    cy.visit('/dashboard/marketing/JustListed/Email')
    skipOnBoarding()
    customizeTemplate()
    chooseListing()
  })
})
