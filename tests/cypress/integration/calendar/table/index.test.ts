describe('Deals list', () => {
  beforeEach(() => {
    cy.clock(new Date(2010, 0, 1).getTime())
    cy.signin()
    cy.visit('/dashboard/calendar')
  })

  it('Should load calendar page', () => {
    cy.waitForPage('/dashboard/calendar')
  })

  it('Should render send a card action only for the contact birthday', () => {
    const CONTACT_BIRTHDAY_EVENT_TYPE_LABEL = 'Birthday'
    const CHILD_BIRTHDAY_EVENT_TYPE_LABEL = 'Child Birthday'
    const SPOUSE_BIRTHDAY_EVENT_TYPE_LABEL = 'Spouse Birthday'

    cy.getByTestSelector(`event-type-${CONTACT_BIRTHDAY_EVENT_TYPE_LABEL}`)
      .first()
      .parent()
      .parent()
      .scrollIntoView()
      .contains('Send a Card')

    cy.getByTestSelector(`event-type-${CHILD_BIRTHDAY_EVENT_TYPE_LABEL}`)
      .first()
      .parent()
      .parent()
      .scrollIntoView()
      .should('not.contain', 'Send a Card')

    cy.getByTestSelector(`event-type-${SPOUSE_BIRTHDAY_EVENT_TYPE_LABEL}`)
      .first()
      .parent()
      .parent()
      .scrollIntoView()
      .should('not.contain', 'Send a Card')
  })
})
