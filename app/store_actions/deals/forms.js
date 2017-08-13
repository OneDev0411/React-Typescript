import _ from 'underscore'
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

export function editForm(task) {
  return {
    type: types.SET_EDIT_FORM,
    task
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
