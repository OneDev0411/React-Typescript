import { attachmentsConditions, tasksConditions } from '../data-collection'

export function selectActions(type, data) {
  let list = []

  if (type === 'task') {
    list = tasksConditions
  }

  if (type === 'attachment') {
    list = attachmentsConditions
  }

  const item = list.find(collection => collection.conditions(data) === true)

  return (
    item &&
    item.actions.filter(
      // temporary hide not-implemented actions
      button => ['email', 'rename', 'print'].includes(button.id) === false
    )
  )
}
