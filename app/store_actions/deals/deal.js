import _ from 'underscore'
import types from '../../constants/deals'
import Deals from '../../models/Deal'

function initializeDeals(deals) {
  return {
    type: types.GET_DEALS,
    deals
  }
}

function addNewDeal(deal) {
  return {
    type: types.CREATE_DEAL,
    deal
  }
}

export function getDeals(user) {
  return async (dispatch) => {
    const deals = await Deals.getAll(user)
    const indexedDeals = _.indexBy(deals, 'id')

    dispatch(initializeDeals(indexedDeals))
  }
}


export function createDeal(data) {
  return async (dispatch) => {
    const deal = await Deals.create(data)
    // dispatch
    dispatch(addNewDeal(deal))

    return deal
  }
}
