import _ from 'underscore'

import { STATES } from 'utils/address'

export function stateToAbbreviated(stateName) {
  return _.findKey(STATES, name => name === stateName)
}
