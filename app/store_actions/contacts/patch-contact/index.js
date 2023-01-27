import { normalize } from 'normalizr'

import * as actionTypes from '../../../constants/contacts'
import { contactsSchema } from '../../../models/contacts/schema'

export function patchContact(newContact) {
  return dispatch => {
    dispatch({
      type: actionTypes.PATCH_CONTACT_SUCCESS,
      response: normalize({ contacts: [newContact] }, contactsSchema)
    })
  }
}

export default patchContact
