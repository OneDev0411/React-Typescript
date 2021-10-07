import sortBy from 'lodash/sortBy'

import { StateContext } from 'deals/contexts/actions-context'

import { actionsDefaultProperties } from '../default-properties'

interface TaskActions {
  isTaskViewActionActive: boolean
  isTaskDocusignActionActive: boolean
}

export function normalizeActions(
  stateActions: StateContext['actions'],
  actions: ActionButtonId[],
  { isTaskViewActionActive, isTaskDocusignActionActive }: TaskActions
): ActionButton[] {
  if (stateActions.length > 0) {
    return stateActions
      .filter(id => actions.includes(id))
      .map((id: ActionButtonId) => {
        return {
          id,
          ...actionsDefaultProperties[id]
        }
      })
  }

  const nextActions: ActionButton[] = actions.map((id: ActionButtonId) => {
    return {
      id,
      ...actionsDefaultProperties[id]
    }
  })

  let preferredActions: string[] = []

  if (isTaskViewActionActive) {
    preferredActions = ['view-file', 'view-form', 'view-envelope']
  }

  if (isTaskDocusignActionActive) {
    preferredActions = ['docusign-file', 'docusign-form', 'docusign-envelope']
  }

  return sortBy<ActionButton>(nextActions, (action, index) =>
    preferredActions.includes(action.type) ? -1 : index
  )
}
