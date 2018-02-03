import types from '../../constants/contact'
import Contact from '../../models/Contact'
import { batchActions } from 'redux-batched-actions'
import { addNotification as notify } from 'reapop'

export function removeImportResult() {
  return { type: types.REMOVE_IMPORT_RESULT }
}

export function loginSusseful() {
  return { type: types.IMPORT_SUCCESSFUL_LOGIN }
}

export function importFail() {
  return { type: types.IMPORT_FAIL_LOGIN }
}

export function importDone() {
  return dispatch => {
    dispatch(notifyResult({}))

    dispatch({ type: types.IMPORT_DONE })
  }
}

function contactsFetched(body) {
  return {
    type: types.UPLOAD_CVS,
    contacts: body.data || {},
    info: body.info
  }
}

export function notifyResult(info) {
  const status = info.errors ? 'warning' : 'success'
  let message

  if (info.count) {
    message = `<p>Successfully imported: ${info.count - info.errors}`

    if (info.error) {
      message += `<br /> Not imported: ${info.errors}</p>`
    }
  } else {
    message = 'Contacts have been imported successfuly!'
  }

  return notify({
    allowHTML: true,
    title: 'Contact import complete!',
    message,
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
