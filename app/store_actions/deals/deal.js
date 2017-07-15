import _ from 'underscore'
import types from '../../constants/deals'
import Deals from '../../models/Deal'

function initializeDeals (deals) {
  return {
    type: types.GET_DEALS,
    deals
  }
}

export function getDeals(user) {
  return async (dispatch) => {
    const deals = await Deals.getAll(user)
    const indexedDeals = _.indexBy(deals, 'id')

    dispatch(initializeDeals(indexedDeals))
  }
}
