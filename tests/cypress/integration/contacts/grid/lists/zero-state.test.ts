/**
 * NOTE: unit test would have been a more reasonable type of test for zero state
 * display logic, but e2e is chosen because the whole contacts list component
 * is subject to rewrite in future
 */
describe('Contacts zero state', () => {
  beforeEach(() => {
    cy.signin()
  })

  /**
   * #2992
   *
   * NOTE: this test assumes there is no contact with "W" alphabet filter.
   */
  it('Zero state should not be shown when letter filter is set and nothing matches', () => {
    cy.visit('/dashboard/contacts?letter=W')
    cy.contains('No Results')
  })
})
