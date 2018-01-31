import types from '../../constants/contact'
import Contact from '../../models/Contact'
import { batchActions } from 'redux-batched-actions'
import { addNotification as notify } from 'reapop'

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
function notifyResult(info) {
  const status = info.errors ? 'warning' : 'success'

  return notify({
    allowHTML: true,
    title: 'Import done',
    message:
      `<p>Successfully imported: ${info.count - info.errors}` +
      (info.errors ? `<br /> Not imported: ${info.errors}</p>` : ''),
    status
  })
}

export function uplaodCsv(file, fileName = null) {
  return async dispatch => {
    try {
      dispatch({ type: types.SHOW_SPINNER })

      const response = await Contact.uplaodCsv(file, fileName)

      if (response) {
        batchActions([
          dispatch({ type: types.HIDE_SPINNER }),
          dispatch(contactsFetched(response.body)),
          dispatch(notifyResult(response.body.info))
        ])
      } else {
        dispatch({ type: types.HIDE_SPINNER })
      }
    } catch (e) {
      batchActions([
        dispatch({ type: types.HIDE_SPINNER }),
        dispatch(
          notify({
            title: 'Import failed',
            message: e.message,
            status: 'error'
          })
        )
      ])
    }
  }
}
