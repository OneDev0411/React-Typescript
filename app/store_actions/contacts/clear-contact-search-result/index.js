import { batchActions } from 'redux-batched-actions'

import { CLEAR_CONTACTS_LIST } from '../../../constants/contacts'
import { getContacts } from '../get-contacts'
import { clearContactPages } from '../pagination'

export function clearContactSearchResult(page = 1, limit = 50) {
  return async dispatch => {
    batchActions([
      dispatch({
        type: CLEAR_CONTACTS_LIST
      }),
      dispatch(clearContactPages)
    ])

    return dispatch(getContacts(page, limit))
  }
}
