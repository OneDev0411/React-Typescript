describe('Contacts list, search a text', () => {
  beforeEach(() => {
    cy.sandbox()
    cy.signin()
    cy.visit('/dashboard/contacts')
  })

  it('Search Daniel and the grid should has an item contains Daniel Day-Lewis', () => {
    cy.getByTestSelector('contacts-list-search').find('input').type('Daniel')

    cy.wait(2000)

    cy.getByTestSelector('contact-link', { timeout: 100 }).should(($el: HTMLAnchorElement): void => {
      expect($el).to.have.text('Daniel Day-Lewis')
    })
  })
})
