import { normalize } from 'normalizr'
import { contactsSchema } from '../../../models/contacts/schema'
import postNewAttributes from '../../../models/contacts/post-new-attributes'
import * as actionTypes from '../../../constants/contacts'

const addNewAttributes = ({
  contactId = '',
  attributes = []
}) => async dispatch => {
  if (!contactId || attributes.length === 0) {
    return Promise.resolve()
  }

  try {
    dispatch({
      type: actionTypes.POST_NEW_ATTRIBUTES_REQUEST
    })

    const contact = await postNewAttributes({ contactId, attributes })
    const response = normalize({ contacts: [contact] }, contactsSchema)

    dispatch({
      response,
      type: actionTypes.POST_NEW_ATTRIBUTES_SUCCESS
    })

    return contact
  } catch (error) {
    dispatch({
      error,
      type: actionTypes.POST_NEW_ATTRIBUTES_FAILURE
    })
    throw error
  }
}

export default addNewAttributes
