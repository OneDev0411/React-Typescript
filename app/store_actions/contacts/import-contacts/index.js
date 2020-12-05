import { addNotification as notify } from 'components/notification'

import * as types from '../../../constants/contacts'

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
