import { documentsConditions, tasksConditions } from '../data-collection'

export function selectActions(type, data) {
  let list = []

  if (type === 'task') {
    list = tasksConditions
  }

  if (type === 'document') {
    list = documentsConditions
  }

  const item = list.find(collection => collection.conditions(data) === true)

  return (
    item &&
    item.actions.filter(
      // temporary hide email and rename actions
      button => ['5', '10'].includes(button.id) === false
    )
  )
}
