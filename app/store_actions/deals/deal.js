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

export function getDeals(user) {
  return async (dispatch) => {
    const data = await Deals.getAll(user)
    const { entities } = normalize(data, schema.dealsSchema)
    const { deals, checklists, tasks } = entities

    batchActions([
      dispatch(setDeals(deals)),
      dispatch(setChecklists(checklists)),
      dispatch(setTasks(tasks))
    ])
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
