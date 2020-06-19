import { StateContext } from 'deals/Dashboard/Folders/actions-context'

import { actionsDefaultProperties } from '../default-properties'
import {
  DOCUSIGN_FORM,
  DOCUSIGN_ENVELOPE,
  DOCUSIGN_FILE
} from '../action-buttons'

export function normalizeActions(
  stateActions: StateContext['actions'],
  actions: ActionButtonId[]
): ActionButton[] {
  if (stateActions.length > 0) {
    const properties = [DOCUSIGN_FORM, DOCUSIGN_ENVELOPE, DOCUSIGN_FILE].reduce(
      (acc, id) => {
        if (actions.includes(id)) {
          return {
            ...acc,
            [id]: {
              ...actionsDefaultProperties[id],
              label: 'Add To Docusign'
            }
          }
        }

        return acc
      },
      { actionsDefaultProperties }
    )

    return stateActions
      .filter(id => actions.includes(id))
      .map((id: ActionButtonId) => {
        return {
          id,
          ...properties[id]
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
