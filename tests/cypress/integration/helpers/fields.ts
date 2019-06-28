export function setInlineDateField(
  date: Date = new Date(),
  ignoreYear: boolean = false,
  dateFieldDataTest: string = 'date-field'
) {
  cy.getByTestSelector(dateFieldDataTest).within(() => {
    cy.get('div')
      .first()
      .click()
      .within(() => {
        cy.get('div')
          .first()
          .children()
          .eq(date.getMonth())
          .click()
      })

    cy.get('div')
      .eq(1)
      .click()
      .within(() => {
        cy.get('div')
          .first()
          .children()
          .eq(date.getDate() - 1)
          .click()
      })

    if (!ignoreYear) {
      cy.get('input[type=text]')
        .first()
        .type(date.getFullYear().toString())
    }
  })

  return cy
    .getByTestSelector(dateFieldDataTest)
    .next()
    .within(() => {
      cy.get('div')
        .first()
        .within(() => {
          cy.get('button')
            .last()
            .click()
        })
    })
}
