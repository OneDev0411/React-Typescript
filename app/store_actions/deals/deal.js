import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'
import _ from 'underscore'
import types from '../../constants/deals'
import Deal from '../../models/Deal'
import * as schema from './schema'
import { setTasks } from './task'
import { setChecklists } from './checklist'

function setDeals(deals) {
  return {
    type: types.GET_DEALS,
    deals
  }
}

function addSearchedDeals(deals) {
  return {
    type: types.ADD_SEARCHED_DEALS,
    deals
  }
}

function addNewDeal(deal) {
  return {
    type: types.CREATE_DEAL,
    deal
  }
}

function isBackOffice(status) {
  return {
    type: types.IS_BACK_OFFICE,
    status
  }
}

function dealUpdated(deal) {
  return {
    type: types.UPDATE_DEAL,
    deal
  }
}

export function dealArchived(deal_id) {
  return {
    type: types.ARCHIVE_DEAL,
    deal_id
  }
}

export function appendChecklist(deal_id, checklist_id) {
  return {
    type: types.APPEND_CHECKLIST,
    deal_id,
    checklist_id
  }
}

export function archiveDeal(dealId) {
  return async (dispatch) => {
    await Deal.archiveDeal(dealId)
    dispatch(dealArchived(dealId))
  }
}

export function updateListing(dealId, listingId) {
  return async (dispatch) => {
    const deal = await Deal.updateListing(dealId, listingId)

    dispatch(updateDeal(deal))
  }
}

export function updateDeal(deal) {
  return async (dispatch) => {
    const { entities } = normalize(deal, schema.dealSchema)
    const { deals, checklists, tasks } = entities

    batchActions([
      dispatch(setTasks(tasks)),
      dispatch(setChecklists(checklists)),
      dispatch(dealUpdated(deals[deal.id]))
    ])
  }
}

export function getDeals(user, backoffice = false, errorOnFail = true) {
  return async (dispatch) => {
    // set user is backoffice or not

    try {
      // get deals (brand is backoffice)
      const data = await Deal.getAll(user, backoffice)

      dispatch({ type: types.HIDE_SPINNER })

      if (data.length === 0) {
        return dispatch({ type: types.NO_DEAL })
      }

      const { entities } = normalize(data, schema.dealsSchema)
      const { deals, checklists, tasks } = entities

      batchActions([
        dispatch(setTasks(tasks)),
        dispatch(setChecklists(checklists)),
        dispatch(setDeals(deals))
      ])
    } catch (e) {
      if (errorOnFail) {
        dispatch({
          type: types.GET_DEALS_FAILED,
          name: 'get-deals',
          message: e.response ? e.response.body.message : null
        })
      }
    }
  }
}

export function createDeal(deal) {
  return async (dispatch) => {
    const { entities } = normalize(deal, schema.dealSchema)
    const { deals, checklists, tasks } = entities

    batchActions([
      dispatch(setTasks(tasks)),
      dispatch(setChecklists(checklists)),
      dispatch(addNewDeal(deals[deal.id]))
    ])
  }
}

export function searchAllDeals(query) {
  return async (dispatch) => {
    try {
      dispatch({ type: types.SHOW_SPINNER })


      const data = await Deal.searchAllDeals(query)

      dispatch({ type: types.HIDE_SPINNER })

      if (data.length === 0) {
        dispatch(addSearchedDeals({}))
      }

      const { entities } = normalize(data, schema.dealsSchema)
      const { deals, checklists, tasks } = entities

      _.each(deals, deal => deal.searchResult = true)

      batchActions([
        dispatch(setTasks(tasks)),
        dispatch(setChecklists(checklists)),
        dispatch(addSearchedDeals(deals))
      ])
    } catch (e) {
      dispatch({
        type: types.GET_DEALS_FAILED,
        name: 'get-deals',
        message: e.response ? e.response.body.message : null
      })
    }
  }
}
