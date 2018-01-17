import _ from 'underscore'
import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_DEALS_FAILED:
      return {}

    case types.ARCHIVE_DEAL:
      return _.omit(state, envelope => envelope.deal === action.deal_id)

    case types.SET_ENVELOPES:
      return {
        ...state,
        ...action.envelopes
      }

    case types.SET_ENVELOPE_STATUS:
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
