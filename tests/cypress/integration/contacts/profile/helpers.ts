import { setDateFieldToFuture } from 'helpers/fields'

// Adds a task from contact profile page
export function addTask(title: string, future = false) {
  cy.getByTestSelector('add-task').type(title)

  if (future) {
    setDateFieldToFuture()
  }

  cy.getByTestSelector('save-task').click()
}
