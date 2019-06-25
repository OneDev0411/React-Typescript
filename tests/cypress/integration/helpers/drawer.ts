export function submitDrawerForm(): ReturnType<typeof cy.getByTestSelector> {
  return cy.getByTestSelector('open-drawer-content').within(() => {
    cy.get('button[type=submit]').click()
  })
}
