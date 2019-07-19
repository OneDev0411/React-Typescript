import { setInlineDateField, setDateFieldToFuture } from 'helpers/fields'
import {
  acceptConfirmationModal,
  cancelConfirmationModal,
  waitForModalToClose
} from 'helpers/modal'
import { getTestSelector } from 'helpers/page'
import { fillEmailComposeDrawer, waitForDrawerToClose } from 'helpers/drawer'

import { addTask } from './helpers'

const EMPTY_CONTACT_ID = '9f70a596-7c23-4c6c-bed3-c3d0e224c810'

describe('Contact profile', () => {
  beforeEach(() => {
    cy.sandbox()
    cy.signin()
  })

  it('User can edit birthdays for contact, spouse and child', () => {
    cy.visit(`/dashboard/contacts/${EMPTY_CONTACT_ID}`)

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

  it.only('User can create and see created email event in contact profile', () => {
    cy.visit(`/dashboard/contacts/${EMPTY_CONTACT_ID}`)

    const subject = 'test subject'
    const content = 'test content'

    const futureSubject = 'test subject future'
    const futureContent = 'test content future'

    // Normal send
    cy.getByTestSelector('send-email').click()
    fillEmailComposeDrawer(subject, content)
    cy.getByTestSelector('compose-send-email').click()
    waitForDrawerToClose()
    cy.pageShouldContain(subject)
    cy.pageShouldContain(content)

    // Scheduled send
    cy.getByTestSelector('send-email').click()
    fillEmailComposeDrawer(futureSubject, futureContent)
    cy.getByTestSelector('compose-schedule-email').click()
    setDateFieldToFuture(true)
    cy.getByTestSelector('compose-send-email').click()
    waitForDrawerToClose()
    cy.pageShouldContain(futureSubject)
    cy.pageShouldContain(futureContent)
  })

  it('User can create events/tasks and mark them as done from contact profile', () => {
    cy.visit(`/dashboard/contacts/${EMPTY_CONTACT_ID}`)

    const taskTitle = 'Call and tell him you are breathtaking'
    const futureTaskTitle = `${taskTitle} in the future`

    const crmTaskItemDataTest = 'crm-task-item'
    const crmTaskItemGeneralInfo = 'crm-task-item-general-info'
    const nextMonthDate = new Date()

    nextMonthDate.setMonth((nextMonthDate.getMonth() + 1) % 12)

    const nextMonthShortName = nextMonthDate.toLocaleString('en-us', {
      month: 'short'
    })

    addTask(taskTitle)
    cy.getByTestSelector(crmTaskItemDataTest)
      .first()
      .within(() => {
        cy.contains(taskTitle)
        cy.getByTestSelector(crmTaskItemGeneralInfo).within(() => {
          // it should be marked as done (svg inside button)
          cy.get('svg', { timeout: 10000 }).should('exist')
        })
      })

    addTask(futureTaskTitle, true)

    // now we should wait to have 2 tasks here
    cy.getByTestSelector(crmTaskItemDataTest).should('have.length', 2)

    cy.getByTestSelector(crmTaskItemDataTest)
      .first()
      .within(() => {
        cy.contains(futureTaskTitle)
        cy.contains(nextMonthShortName)
        cy.getByTestSelector(crmTaskItemGeneralInfo).within(() => {
          // it shouldn't be marked as done (svg inside button)
          cy.get('svg', { timeout: 10000 }).should('not.exist')
          cy.get('button').click() // toggle task
        })
      })
    cancelConfirmationModal() // not now!
    waitForModalToClose()

    cy.get(
      `${getTestSelector([crmTaskItemDataTest, crmTaskItemGeneralInfo])} svg`
    ).should('have.length', 1)

    cy.getByTestSelector(crmTaskItemDataTest)
      .first()
      .within(() => {
        cy.get('button').click() // toggle task
      })
    acceptConfirmationModal() // now!
    waitForModalToClose()

    cy.get(
      `${getTestSelector([crmTaskItemDataTest, crmTaskItemGeneralInfo])} svg`
    ).should('have.length', 2)

    // make sure that future task month is changed to current
    cy.should('not.contain', nextMonthShortName)
  })
})
