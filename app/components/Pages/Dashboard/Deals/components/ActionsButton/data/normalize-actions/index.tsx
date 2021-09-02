import sortBy from 'lodash/sortBy'

import { StateContext } from 'deals/contexts/actions-context'

import { actionsDefaultProperties } from '../default-properties'

export function normalizeActions(
  stateActions: StateContext['actions'],
  actions: ActionButtonId[],
  isViewActionActive: boolean
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

  if (isViewActionActive) {
    return sortBy<ActionButton>(nextActions, (action, index) => {
      const isViewAction = ['view-file', 'view-form', 'view-envelope'].includes(
        action.type
      )

      return isViewAction ? -1 : index
    })
  }

  return nextActions
}
