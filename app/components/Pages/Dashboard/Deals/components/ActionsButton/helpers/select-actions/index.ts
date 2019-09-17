import documentsConditions from '../../data/table/documents'
import tasksConditions from '../../data/table/tasks'

export interface ActionConditions {
  has_task?: boolean
  document_type?: 'Form' | 'Pdf' | 'Generic'
  file_uploaded: boolean
  form_saved: boolean
  envelope_status: EnvelopeStatus
  task_type?: 'Form' | 'Generic'
  is_backoffice?: boolean
  is_task_notified?: boolean
}

export interface ActionItem {
  label:
    | string
    | PropertyFunction<
        {
          task: IDealTask
          isBackOffice: boolean
        },
        string
      >
  type: string
  tooltip?: string
  primary?: boolean
  disabled?: boolean
  condition(conditions: ActionConditions): boolean
}

interface ActionsList {
  conditions(conditions: ActionConditions): boolean
  actions: ActionItem[]
}

export function selectActions(type: string, conditions: ActionConditions) {
  let list: ActionsList[] = []

  if (type === 'task') {
    list = tasksConditions as ActionsList[]
  }

  if (type === 'document') {
    list = documentsConditions as ActionsList[]
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
