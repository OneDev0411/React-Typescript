import _ from 'underscore'
import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'
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

export function getDeals(user, backoffice = false) {
  return async (dispatch) => {
    // set user is backoffice or not
    dispatch(isBackOffice(backoffice))

    try {
      // get deals (brand is backoffice)
      const data = await Deal.getAll(user, backoffice)

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
      dispatch({
        type: types.GET_DEALS_FAILED,
        name: 'get-deals',
        message: e.response ? e.response.body.message : null
      })
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
