import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'
import { addNotification as notify } from 'reapop'

function _getChecklists(checklists) {
  return {
    type: types.GET_CHECKLISTS,
    checklists
  }
}

export function getChecklists(brand) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.getChecklists(brand)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_getChecklists(data))
    } else {
      dispatch(
        notify({
          message: `getChecklists: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

function _addChecklist(checklist) {
  return {
    type: types.ADD_CHECKLIST,
    checklist
  }
}

export function addChecklist(brand, checklist) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.addChecklist(brand, checklist)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_addChecklist(data))
    } else {
      dispatch(
        notify({
          message: `addChecklist: ${response.error.message}`,
          status: 'error'
        })
      )
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
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.deleteChecklist(checklist)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      dispatch(_deleteChecklist(checklist.id))
    } else {
      dispatch(
        notify({
          message: `deleteChecklist: ${response.error.message}`,
          status: 'error'
        })
      )
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
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.editChecklist(checklist)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_editChecklist(data))
    } else {
      dispatch(
        notify({
          message: `editChecklist: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}
