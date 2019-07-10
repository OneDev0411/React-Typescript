// Adds a task from contact profile page
// TODO: Implement add a task with a specific date and and time after UI redesign
export function addTask(title: string, future: boolean = false) {
  cy.getByTestSelector('add-task').type(title)

  if (future) {
    cy.getByTestSelector('date-time-picker-button').click()
    cy.get('.DayPicker-NavButton--next').click()
    cy.get('.DayPicker-Day')
      .last()
      .click()
    cy.getByTestSelector('date-picker-done').click()
  }

  cy.getByTestSelector('save-task').click()
}
