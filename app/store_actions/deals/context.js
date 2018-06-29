import * as actionTypes from '../../constants/deals'
import Deal from '../../models/Deal'
import { updateDeal } from './deal'

export function updateContext(dealId, ctx) {
  return async dispatch => {
    const deal = await Deal.updateContext(dealId, ctx)

    dispatch(updateDeal(deal))
  }
}

export function approveContext(dealId, contextId) {
  return async dispatch => {
    const deal = await Deal.approveContext(dealId, contextId)

    dispatch(updateDeal(deal))
  }
}

export function getContexts(user = {}) {
  return async dispatch => {
    const contexts = await Deal.getContexts(user)

    dispatch({
      type: actionTypes.GET_CONTEXTS,
      contexts
    })
  }
}
