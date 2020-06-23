import { StateContext } from 'deals/Dashboard/Folders/actions-context'

import { actionsDefaultProperties } from '../default-properties'

export function normalizeActions(
  stateActions: StateContext['actions'],
  actions: ActionButtonId[]
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

  return actions.map((id: ActionButtonId) => {
    return {
      id,
      ...actionsDefaultProperties[id]
    }
  })
}
