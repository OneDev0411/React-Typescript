import { setInlineDateField } from 'helpers/fields'

import { createContact } from '../grid/helpers'

const contact = { firstName: 'David', lastName: 'Beckham' }

describe('Contact profile', () => {
  beforeEach(() => {
    cy.sandbox()
    cy.signin()
  })

  it('User can edit birthdays for contact, spouse and child', () => {
    cy.visit('/dashboard/contacts')
    createContact(contact)

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

  it.only('User can log and create events/tasks from contact profile', () => {
    const taskTitle = 'Call David about new contract'
    const futureTaskTitle = `${taskTitle} in the future`

    cy.visit('/dashboard/contacts')
    createContact(contact)
    cy.getByTestSelector('add-task').type(taskTitle)
    cy.getByTestSelector('save-task').click()
    cy.getByTestSelector('crm-task-item-general-info')
      .first()
      .within(() => {
        cy.contains(taskTitle)
        cy.get('div > button')
          .children()
          .should('have.length', 1)
      }) // it should be marked as done

    cy.getByTestSelector('add-task').type(futureTaskTitle)
    cy.getByTestSelector('date-time-picker-button').click()
    cy.get('.DayPicker-NavButton--next').click()
    cy.get('.DayPicker-Day')
      .last()
      .click()
    cy.getByTestSelector('date-picker-done').click()
    cy.getByTestSelector('save-task').click()

    // now we should wait until we got 2 tasks here
    cy.getByTestSelector('crm-task-item-general-info').should('have.length', 2)

    cy.getByTestSelector('crm-task-item-general-info')
      .first()
      .within(() => {
        cy.contains(futureTaskTitle)
        cy.get('div > button')
          .children()
          .should('have.length', 0)
      }) // it shouldn't be marked as done
  })
})
