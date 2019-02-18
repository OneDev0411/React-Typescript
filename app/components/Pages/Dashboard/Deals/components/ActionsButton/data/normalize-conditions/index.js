import _ from 'underscore'

import { actionsDefaultProperties } from '../default-properties'

export function normalizeConditions(conditions) {
  return conditions.map(item => ({
    ...item,
    actions: _.map(item.actions, (properties, id) => ({
      id,
      ...properties,
      ...actionsDefaultProperties[id]
    }))
  }))
}
