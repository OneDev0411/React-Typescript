import {
  documentsConditions as agentDocumentsConditions,
  tasksConditions as agentTasksConditions
} from '../../data/tables/agent'

import {
  tasksConditions as backofficeTasksConditions,
  documentsConditions as backofficeDocumentsConditions
} from '../../data/tables/backoffice'

export function selectActions(type, conditions, isBackOffice) {
  let list = []

  if (type === 'task') {
    list = isBackOffice ? backofficeTasksConditions : agentTasksConditions
  }

  if (type === 'document') {
    list = isBackOffice
      ? backofficeDocumentsConditions
      : agentDocumentsConditions
  }

  const item = list.find(
    collection => collection.conditions(conditions) === true
  )

  return item && item.actions
}
