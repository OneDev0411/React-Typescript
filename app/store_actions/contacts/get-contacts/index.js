import fetchContacts from '../../../models/contacts/get-contacts'
import * as actionTypes from '../../../constants/contacts'

const getContacts = (user = {}, params) => async (dispatch, getState) => {
  if (Object.keys(user).length === 0) {
    ;({ user } = getState())
  }

  try {
    dispatch({
      type: actionTypes.FETCH_CONTACTS_REQUEST
    })

    const response = await fetchContacts(user, params)

    dispatch({
      response,
      type: actionTypes.FETCH_CONTACTS_SUCCESS
    })
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_CONTACTS_FAILURE,
      message: error.message || 'Something went wrong.'
    })
    throw error
  }
}

export default getContacts
