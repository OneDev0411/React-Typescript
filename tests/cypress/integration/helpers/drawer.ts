export function submitDrawerForm() {
  return cy.getByTestSelector('open-drawer-content').within(() => {
    cy.get('button[type=submit]').click()
  })
}
