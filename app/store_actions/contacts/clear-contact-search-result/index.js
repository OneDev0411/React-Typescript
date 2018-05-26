import { CLEAR_CONTACTS_LIST } from '../../../constants/contacts'
import { getContacts } from '../get-contacts'

export function clearContactSearchResult(page = 1, limit = 50) {
  return async dispatch => {
    dispatch({
      type: CLEAR_CONTACTS_LIST
    })

    return dispatch(getContacts(page, limit))
  }
}
