import { batch } from 'react-redux'
import _ from 'underscore'

import * as actionTypes from '../../../../constants/deals'
import { setEnvelopes } from '../set-envelopes'

export function createEnvelope(envelope) {
  return async dispatch => {
    // create indexed envelops
    const indexedEnvelops = _.indexBy([envelope], 'id')

    batch(() => {
      dispatch(setEnvelopes(indexedEnvelops))

      dispatch({
        type: actionTypes.CREATE_ENVELOPE,
        deal_id: envelope.deal,
        envelope
      })
    })
  }
}
