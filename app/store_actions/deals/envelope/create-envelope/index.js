import _ from 'underscore'
import { batchActions } from 'redux-batched-actions'

import * as actionTypes from '../../../../constants/deals'
import { setEnvelopes } from '../set-envelopes'

export function createEnvelope(envelope) {
  return async dispatch => {
    // create indexed envelops
    const indexedEnvelops = _.indexBy([envelope], 'id')

    batchActions([
      dispatch(setEnvelopes(indexedEnvelops)),
      dispatch({
        type: actionTypes.CREATE_ENVELOPE,
        deal_id: envelope.deal,
        envelope
      })
    ])
  }
}
