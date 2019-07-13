import cuid from 'cuid'

import { expandShowMoreLess } from 'helpers/page'

import { createList } from './create'
import { deleteList } from './delete'

describe('Contacts saved lists', () => {
  const listName = `test-list-${cuid()}`
  const secondListName = `test-list-${cuid()}`

  beforeEach(() => {
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/contacts')
  })

  it('User should be able to create contacts lists', () => {
    expandShowMoreLess('lists-list')
    createList(listName)
    createList(secondListName)
    cy.pageShouldContain(listName)
    cy.pageShouldContain(secondListName)
  })

  it('User should be able to delete contacts lists', () => {
    expandShowMoreLess('lists-list')
    deleteList(listName)
    deleteList(secondListName)
    cy.waitForRemove(listName)
    cy.waitForRemove(secondListName)
  })
})
