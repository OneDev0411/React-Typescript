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

// Sets draft-js based text editor content
export function setTextEditorData(content: string) {
  cy.getByTestSelector('text-editor-wrapper')
    .last()
    .within(() => {
      cy.get('.public-DraftEditor-content').type(content)
    })
}

// Sets date field to last day of next month
// TODO: Add another function with functionality of
// setting a specific date and time
export function setDateFieldToFuture(isPickerAlreadyOpen = false) {
  if (!isPickerAlreadyOpen) {
    cy.getByTestSelector('date-time-picker-button').click()
  }

  cy.get('.DayPicker-NavButton--next').click()
  cy.get('.DayPicker-Day')
    .last()
    .click()
  cy.getByTestSelector('date-picker-done').click()
}
