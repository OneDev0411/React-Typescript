import _ from 'underscore'
import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'
import types from '../../constants/deals'
import Deals from '../../models/Deal'
import * as schema from './schema'

function setDeals(deals) {
  return {
    type: types.GET_DEALS,
    deals
  }
}

function setTasks(tasks) {
  return {
    type: types.GET_TASKS,
    tasks
  }
}

function updateRoles(deal_id, roles) {
  return {
    type: types.UPDATE_ROLES,
    deal_id,
    roles
  }
}

function setChecklists(checklists) {
  return {
    type: types.GET_CHECKLISTS,
    checklists
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

export function createRole(deal_id, form) {
  return async (dispatch) => {
    const deal = await Deals.createRole(deal_id, form)
    dispatch(updateRoles(deal.id, deal.roles))
  }
}

export function getDeals(user, backoffice = false) {
  return async (dispatch) => {
    // set user is backoffice or not
    dispatch(isBackOffice(backoffice))

    try {
      // get deals (brand is backoffice)
      const data = await Deals.getAll(user, backoffice)

      if (data.length === 0) {
        return dispatch({ type: types.NO_DEAL })
      }

      const { entities } = normalize(data, schema.dealsSchema)
      const { deals, checklists, tasks } = entities

      batchActions([
        dispatch(setDeals(deals)),
        dispatch(setChecklists(checklists)),
        dispatch(setTasks(tasks))
      ])
    } catch(e) {
      dispatch({
        type: types.GET_DEALS_FAILED,
        name: 'Get Deals',
        message: e.response ? e.response.text : 'Can not get deals'
      })
    }
  }
}


export function createDeal(data) {
  return async (dispatch) => {
    const deal = await Deals.create(data)
    const { entities } = normalize(deal, schema.dealSchema)
    const { deals, checklists, tasks } = entities

    batchActions([
      dispatch(addNewDeal(deals[deal.id])),
      dispatch(setChecklists(checklists)),
      dispatch(setTasks(tasks))
    ])

    return deal
  }
}
