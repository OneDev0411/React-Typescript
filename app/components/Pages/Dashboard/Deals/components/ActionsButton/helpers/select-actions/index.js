import documentsConditions from '../../data/table/documents'
import tasksConditions from '../../data/table/tasks'

export function selectActions(type, conditions) {
  let list = []

  if (type === 'task') {
    list = tasksConditions
  }

  if (type === 'document') {
    list = documentsConditions
  }

  const item = list.find(
    collection => collection.conditions(conditions) === true
  )

  if (!item) {
    return null
  }

  return item.actions.filter(action =>
    typeof action.condition === 'function' ? action.condition(conditions) : true
  )
}
