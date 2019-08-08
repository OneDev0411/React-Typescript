import { acceptConfirmationModal } from 'helpers/modal'

describe('Tag management settings', () => {
  const tagName = 'aaaaaa111111'

  beforeEach(() => {
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/account/manage-tags')
  })

  it('Load tag management settings page', () => {
    cy.waitForPage('/dashboard/account/manage-tags')
    cy.pageShouldContain('Manage Tags')
  })

  it('Create tags', () => {
    cy.getByTestSelector('icon-text-input')
      .type(tagName)
      .type('{enter}')
    cy.pageShouldContain(`"${tagName}" added.`)
    cy.getByTestSelector(`tag-item-${tagName}`)
      .should('exist')
      .should('have.length', 1)
  })

  it('Forbid duplicate tags creation', () => {
    cy.getByTestSelector('icon-text-input')
      .type(tagName)
      .type('{enter}')
    cy.pageShouldContain(`"${tagName}" already exists.`)
    cy.getByTestSelector(`tag-item-${tagName}`).should('have.length', 1)
  })

  it('Delete tags', () => {
    cy.getByTestSelector(`tag-item-${tagName}`).within(() => {
      cy.get('button').click()
    })

    acceptConfirmationModal()
    cy.pageShouldContain(`"${tagName}" deleted.`)
    cy.waitForRemove(`tag-item-${tagName}`)
  })
})
