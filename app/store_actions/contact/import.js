import types from '../../constants/contact'
import Contact from '../../models/Contact'
import { batchActions } from 'redux-batched-actions'

export function removeImportResult() {
  return dispatch => {
    dispatch({ type: types.REMOVE_IMPORT_RESULT })
  }
}

export function loginSusseful() {
  return dispatch({ type: types.IMPORT_SUCCESSFUL_LOGIN })
}

export function importDone() {
  return dispatch({ type: types.IMPORT_DONE })
}

function contactsFetched(body) {
  return {
    type: types.UPLOAD_CVS,
    contacts: body.data || {},
    info: body.info
  }
}

export function uplaodCsv(file, fileName = null) {
  return async dispatch => {
    try {
      dispatch({ type: types.SHOW_SPINNER })

      const response = await Contact.uplaodCsv(file, fileName)

      batchActions([
        dispatch({ type: types.HIDE_SPINNER }),
        dispatch(contactsFetched(response.body))
      ])
    } catch (e) {
      console.log(e)
    }
  }
}
