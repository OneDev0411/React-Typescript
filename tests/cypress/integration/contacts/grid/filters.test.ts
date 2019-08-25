import { addFlowFilter } from '../helpers'

describe('Contacts list, filters', () => {
  beforeEach(() => {
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/contacts')
  })

  it('Apply a flow filter that grid should be empty', () => {
    addFlowFilter()

    cy.wait(2000)

    cy.getByTestSelector('grid-body', { timeout: 100 }).should(($els: NodeList) => {
      expect($els.length).to.be.eq(0)
    })
  })

  it('Apply a flow filter that the flow should be selected on the flows list in the sidebar', () => {
    addFlowFilter()

    cy.wait(2000)

    cy.getByTestSelector('flow-item', { timeout: 100 }).first().should(($el: JQuery) => {
      expect($el).to.have.text('Appointment Missed')
      expect($el.find('input[type=checkbox]')).to.have.value('on')
    })
  })
})
