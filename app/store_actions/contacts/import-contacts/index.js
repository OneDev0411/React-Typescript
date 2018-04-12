// import { normalize } from 'normalizr'
// import { batchActions } from 'redux-batched-actions'
import { addNotification as notify } from 'reapop'

import * as types from '../../../constants/contacts'
// import { contactsSchema } from '../../../models/contacts/schema'
// import uploadContacts from '../../../models/contacts/upload-contacts'

export function removeImportResult() {
  return { type: types.CONTACTS__REMOVE_IMPORT_RESULT }
}

export function loginSuccessful() {
  return { type: types.CONTACTS__IMPORT_SUCCESSFUL_LOGIN }
}

export function importFail() {
  return { type: types.CONTACTS__IMPORT_FAIL_LOGIN }
}

export function importDone() {
  return dispatch => {
    dispatch(
      notify({
        allowHTML: true,
        title: 'Contact import complete!',
        message: 'Contacts have been imported successfuly!',
        status: 'success'
      })
    )

    dispatch({ type: types.CONTACTS__IMPORT_DONE })
  }
}

// function contactsFetched(contacts) {
//   const { data, info } = contacts
//   const normalizedData = normalize({ contacts: data }, contactsSchema)

//   const response = {
//     info,
//     ...normalizedData
//   }

//   return {
//     response,
//     type: types.CONTACTS__UPLOAD_CVS
//   }
// }

// export function notifyResult(info) {
//   const status = info.errors ? 'warning' : 'success'
//   let message

//   if (info.count) {
//     message = `<p>Successfully imported: ${info.count - info.errors}`

//     if (info.error) {
//       message += `<br /> Not imported: ${info.errors}</p>`
//     }
//   } else {
//     message = 'Contacts have been imported successfuly!'
//   }

//   return notify({
//     allowHTML: true,
//     title: 'Contact import complete!',
//     message,
//     status
//   })
// }

// export function uplaodCsv(file, fileName = null) {
//   return async dispatch => {
//     try {
//       dispatch({ type: types.CONTACTS__SHOW_SPINNER })

//       const response = await uploadContacts({ file, fileName })

//       if (response) {
//         batchActions([
//           dispatch({ type: types.CONTACTS__HIDE_SPINNER }),
//           dispatch(contactsFetched(response)),
//           dispatch(notifyResult(response.info))
//         ])
//       } else {
//         dispatch({ type: types.CONTACTS__HIDE_SPINNER })
//       }
//     } catch (e) {
//       batchActions([
//         dispatch({ type: types.CONTACTS__HIDE_SPINNER }),
//         dispatch(
//           notify({
//             title: 'Import failed',
//             message:
//               e.response && e.response.body
//                 ? e.response.body.message
//                 : e.message,
//             status: 'error'
//           })
//         )
//       ])
//     }
//   }
// }
