import _ from 'underscore'

import { actionsDefaultProperties } from '../default-properties'

export function normalizeActions(actions): ActionButton[] {
  return _.map(actions, id => {
    return {
      id,
      ...actionsDefaultProperties[id]
    }
  })
}
