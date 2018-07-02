import * as actionTypes from '../../../../constants/deals'

export function setDeals(deals) {
  return {
    type: actionTypes.GET_DEALS,
    deals
  }
}
