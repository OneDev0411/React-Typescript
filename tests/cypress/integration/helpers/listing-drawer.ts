export function chooseListing(index: number = 0) {
  return cy
    .getByTestSelector('listing-search-drawer-item')
    .eq(index)
    .click({ force: true })
}
