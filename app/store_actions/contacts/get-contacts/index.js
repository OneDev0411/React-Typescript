import getAllContacts from '../../../models/contacts/get-contacts'
import * as getContactsTypes from '../../../constants/contacts/get-contacts'

const getContacts = (user = {}, params) => async (dispatch, getState) => {
  if (Object.keys(user).length === 0) {
    ;({ user } = getState())
  }

  try {
    dispatch({
      type: getContactsTypes.FETCH_CONTACTS_REQUEST
    })

    const response = await getAllContacts(user, params)

    dispatch({
      response,
      type: getContactsTypes.FETCH_CONTACTS_SUCCESS
    })
  } catch (error) {
    dispatch({
      type: getContactsTypes.FETCH_CONTACTS_FAILURE,
      message: error.message || 'Something went wrong.'
    })
    throw error
  }
}

export default getContacts
