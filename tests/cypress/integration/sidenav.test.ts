describe('SideNav component', () => {
  beforeEach(() => {
    cy.signin()
    cy.visit('/dashboard/calendar')
  })

  it('Sidenav items should be in right order', () => {
    cy.getByTestSelector('side-nav-list').within(() => {
      cy.get('li > a')
        .eq(0)
        .should('have.attr', 'href')
        .and('include', 'calendar')

      cy.get('li > a')
        .eq(1)
        .should('have.attr', 'href')
        .and('include', 'contacts')

      cy.get('li > a')
        .eq(2)
        .should('have.attr', 'href')
        .and('include', 'deals')

      cy.get('li > a')
        .eq(3)
        .should('have.attr', 'href')
        .and('include', 'marketing')

      cy.get('li > a')
        .eq(4)
        .should('have.attr', 'href')
        .and('include', 'insights')

      cy.get('li > a')
        .eq(5)
        .should('have.attr', 'href')
        .and('include', 'mls')

      cy.get('li > button').should('have.length', 1)
    })
  })
})
