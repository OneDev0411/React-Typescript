import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'

function _getChecklists(checklists) {
  return {
    type: types.GET_CHECKLISTS,
    checklists
  }
}

export function getChecklists(user) {
  return async (dispatch) => {
    const response = await BrandConsole.getChecklists(user)
    if (response) {
      const { data } = response.body
      dispatch(_getChecklists(data))
    }
  }
}

function _addChecklist(checklist) {
  return {
    type: types.ADD_CHECKLIST,
    checklist
  }
}

export function addChecklist(user, checklist) {
  return async (dispatch) => {
    const response = await BrandConsole.addChecklist(user, checklist)
    if (response) {
      const { data } = response.body
      dispatch(_addChecklist(data))
    }
  }
}

function _deleteChecklist(checklist_id) {
  return {
    type: types.DELETE_CHECKLIST,
    checklist_id
  }
}

export function deleteChecklist(checklist) {
  return async (dispatch) => {
    const response = await BrandConsole.deleteChecklist(checklist)
    if (response &&
      response.body.status === 'success') {
      dispatch(_deleteChecklist(checklist.id))
    }
  }
}

function _editChecklist(checklist) {
  return {
    type: types.EDIT_CHECKLIST,
    checklist
  }
}

export function editChecklist(checklist) {
  return async (dispatch) => {
    const response = await BrandConsole.editChecklist(checklist)
    if (response) {
      const { data } = response.body
      dispatch(_editChecklist(data))
    }
  }
}
