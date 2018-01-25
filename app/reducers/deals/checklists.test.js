import React from 'react'
import { expect } from 'chai'
import _ from 'underscore'
import types from '../../constants/deals'
import reducer from './checklists'
import { checklists } from '../../../tests/helpers/deals/get-normalized-deal'
import checklist from '../../constants/deals/checklist'

describe('Test checklists reducers in deals', () => {
  let dealId
  let checklistId
  let taskId

  beforeEach(() => {
    dealId = '5df08cdc-a7bc-11e7-9647-0242ac11000d'
    checklistId = '5e422ff6-a7bc-11e7-9647-0242ac11000d'
    taskId = '5ea5063a-a7bc-11e7-9647-0242ac11000d'
  })

  test('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(null)
  })

  test('should handle GET_DEALS_FAILED', () => {
    expect(reducer(undefined, {
      type: types.GET_DEALS_FAILED
    })).to.deep.equal({})
  })

  test('should handle ARCHIVE_DEAL', () => {
    expect(reducer(checklists, {
      type: types.ARCHIVE_DEAL,
      deal_id: dealId
    })).to.deep.equal({})
  })

  test('should handle DELETE_TASK', () => {
    const newState = reducer(checklists, {
      type: types.DELETE_TASK,
      checklistId,
      taskId
    })

    expect(newState[checklistId].tasks.length).to.equal(checklists[checklistId].tasks.length - 1)
  })

  test('should handle GET_CHECKLISTS', () => {
    let state = reducer(undefined, {
      type: types.GET_CHECKLISTS,
      checklists
    })

    // expect(state).to.deep.equal(checklists)
    expect(_.size(state)).to.equal(_.size(checklists))

    // add new checklist
    state = reducer(state, {
      type: types.GET_CHECKLISTS,
      checklists: {
        'new-checklist-id': {}
      }
    })

    expect(_.size(state)).to.equal(_.size(checklists) + 1)
  })

  test('should handle UPDATE_CHECKLIST', () => {
    const updatedChecklist = {
      ...checklists[checklistId],
      title: 'New Title',
      is_deactivated: false,
      is_terminated: true
    }

    const newState = reducer(checklists, {
      type: types.UPDATE_CHECKLIST,
      id: checklistId,
      checklist: updatedChecklist
    })

    expect(newState[checklistId].title).to.equal('New Title')
    expect(newState[checklistId].is_deactivated).to.equal(false)
    expect(newState[checklistId].is_terminated).to.equal(true)

    expect(newState).to.deep.equal({
      ...checklists,
      [checklistId]: updatedChecklist
    })
  })

  test('should handle CREATE_TASK', () => {
    const newState = reducer(checklists, {
      type: types.CREATE_TASK,
      list_id: checklistId,
      task: {
        id: 'new-task-id'
      }
    })

    expect(newState[checklistId].tasks.length).to.equal(checklists[checklistId].tasks.length + 1)
  })
})
