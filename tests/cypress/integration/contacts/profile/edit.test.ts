import { setInlineDateField } from 'helpers/fields'

import { createContact } from '../grid/helpers'

const contact = { firstName: 'David', lastName: 'Beckham' }

describe('Contacts profile', () => {
  beforeEach(() => {
    cy.signin()
  })

  it('User can edit birthdays for contact, spouse and child', () => {
    cy.visit('/dashboard/contacts')
    createContact(contact)
    cy.waitForPage(/\/dashboard\/contacts\/.+/)

    const birthdayAttributeTitle = 'Birthday'
    const childBirthdayAttributeTitle = 'Child Birthday'

    cy.getByTestSelector(`contact-attribute-${birthdayAttributeTitle}`)
      .first()
      .click()

    setInlineDateField()

    cy.getByTestSelector(`contact-attribute-${childBirthdayAttributeTitle}`)
      .first()
      .scrollIntoView()
      .click()

    setInlineDateField()

    cy.getByTestSelector(`contact-attribute-${birthdayAttributeTitle}`)
      .eq(1)
      .scrollIntoView()
      .click()

    setInlineDateField()
  })
})
