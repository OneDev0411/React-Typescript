import _ from 'underscore'
import { browserHistory } from 'react-router'
import types from '../../constants/deals'
import Deal from '../../models/Deal'

function initializeForms(forms) {
  return {
    type: types.GET_FORMS,
    forms
  }
}

export function getForms() {
  return async (dispatch) => {
    const forms = await Deal.getForms()
    const indexedForms = _.indexBy(forms, 'id')

    dispatch(initializeForms(indexedForms))
  }
}

function formCreated(checklist) {
  return {
    type: types.ADD_FORM,
    checklist
  }
}

export function addForm(brandId, checklistId, formId) {
  return async (dispatch) => {
    const response = await Deal.addForm(brandId, checklistId, formId)

    dispatch(formCreated(response))
  }
}

function formDeleted(checklistId, formId) {
  return {
    type: types.DELETE_FORM,
    checklistId,
    formId
  }
}

export function deleteForm(checklist, formId) {
  return async (dispatch) => {
    await Deal.deleteForm(checklist, formId)
    dispatch(formDeleted(checklist.id, formId))
  }
}

export function updateSubmission(taskId, submission) {
  return {
    type: types.UPDATE_SUBMISSION,
    taskId,
    submission
  }
}

export function saveSubmission(taskId, formId, state, values) {
  return async (dispatch) => {
    const submission = await Deal.saveSubmission(taskId, formId, state, values)

    dispatch(updateSubmission(taskId, submission))
  }
}
