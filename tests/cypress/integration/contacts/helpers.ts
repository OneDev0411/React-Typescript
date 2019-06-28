export function addTagFilter(index: number = 0) {
  openNewFilterDropdown('Tag')

  cy.getByTestSelector('open-filters-list').click()

  // we can add more options for selecting tag and operator

  cy.getByTestSelector('filter-items-list')
    .children()
    .eq(index)
    .click()

  return cy.getByTestSelector('filter-done-button').click()
}
export function addOpenHouseFilter(index: number = 0) {
  openNewFilterDropdown('Open House')

  return cy
    .getByTestSelector('filter-item')
    .eq(index)
    .click()
}

function openNewFilterDropdown(filterType: 'Tag' | 'Open House' | 'Origin') {
  cy.getByTestSelector('add-filter').click()

  return cy.getByTestSelector(`add-filter-item-${filterType}`).click()
}
