import _ from 'underscore'

import * as actionTypes from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.GET_DEALS_FAILED:
    case actionTypes.CLEAR_DEALS:
      return {}

    case actionTypes.SET_ENVELOPES:
      return {
        ...state,
        ...action.envelopes
      }

    case actionTypes.SET_ENVELOPE_STATUS:
      return {
        ...state,
        [action.envelope_id]: {
          ...state[action.envelope_id],
          status: action.status
        }
      }

    default:
      return state
  }
}

export const selectDealEnvelopes = (deal, state) =>
  Array.isArray(deal.envelopes) ? deal.envelopes.map(id => state[id]) : []
