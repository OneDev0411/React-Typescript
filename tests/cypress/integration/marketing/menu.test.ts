import { skipOnBoarding } from './helpers'

describe('Marketing Center Menu', () => {
  beforeEach(() => {
    cy.signin()
  })

  it('Should select Under Contract type from menu and check the page header elements', () => {
    cy.visit('/dashboard/marketing')
    skipOnBoarding()

    cy.viewport(1600, 800)

    cy.getByTestSelector('mc-store-menu')
      .children()
      .eq(6)
      .should('contain', 'Under Contract')
      .click()
      .should('have.class', 'is-active')

    cy.getByTestSelector('mc-store-page-header')
      .should('have.css', 'background-image')
      .and('match', /JustListed/)

    cy.getByTestSelector('mc-store-page-header')
      .children()
      .eq(1)
      .should('contain', 'Under Contract')

    cy.getByTestSelector('mc-store-page-header')
      .children()
      .eq(2)
      .should('contain', 'Promote your listings via email and social.')
  })
})
