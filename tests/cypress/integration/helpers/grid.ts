export function changeSort(index: number) {
  // TODO: improve sortable selector
  cy.get('div[class*="SortableContainer"] button', { timeout: 20000 })
    .should('be.enabled')
    .first()
    .click({ force: true })
  cy.get('div[class*="SortableContainer"] > div > div')
    .children()
    .eq(index)
    .click()
}
