import _ from 'underscore'
import * as actionTypes from '../../constants/deals'
import Deal from '../../models/Deal'

export function getForms() {
  return async dispatch => {
    const forms = await Deal.getForms()

    dispatch({
      type: actionTypes.GET_FORMS,
      forms: _.indexBy(forms, 'id')
    })
  }
}

function formCreated(checklist) {
  return {
    type: actionTypes.ADD_FORM,
    checklist
  }
}

export function addForm(brandId, checklistId, formId) {
  return async dispatch => {
    const response = await Deal.addForm(brandId, checklistId, formId)

    dispatch(formCreated(response))
  }
}

function formDeleted(checklistId, formId) {
  return {
    type: actionTypes.DELETE_FORM,
    checklistId,
    formId
  }
}

export function deleteForm(checklist, formId) {
  return async dispatch => {
    await Deal.deleteForm(checklist, formId)
    dispatch(formDeleted(checklist.id, formId))
  }
}

export function updateSubmission(taskId, submission) {
  return {
    type: actionTypes.UPDATE_SUBMISSION,
    taskId,
    submission
  }
}

export function saveSubmission(taskId, formId, state, values) {
  return async dispatch => {
    const submission = await Deal.saveSubmission(taskId, formId, state, values)

    dispatch(updateSubmission(taskId, submission))
  }
}
