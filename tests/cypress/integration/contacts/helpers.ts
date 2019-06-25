export function addTagFilter(): ReturnType<typeof cy.getByTestSelector> {
  openNewFilterDropdown('Tag')

  cy.getByTestSelector('open-filters-list').click()

  // we can add more options for selecting tag and operator

  cy.getByTestSelector('filter-items-list')
    .children()
    .first()
    .click()

  return cy.getByTestSelector('filter-done-button').click()
}
export function addOpenHouseFilter(): ReturnType<typeof cy.getByTestSelector> {
  openNewFilterDropdown('Open House')

  return cy
    .getByTestSelector('filter-item')
    .first()
    .click()
}

function openNewFilterDropdown(
  filterType: string
): ReturnType<typeof cy.getByTestSelector> {
  cy.getByTestSelector('add-filter').click()

  return cy.getByTestSelector(`add-filter-item-${filterType}`).click()
}
