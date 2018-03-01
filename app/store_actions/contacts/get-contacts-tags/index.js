import { normalize } from 'normalizr'
import { tagsSchema } from '../../../models/contacts/schema'
import fetchContactsTags from '../../../models/contacts/get-contacts-tags'
import * as actionTypes from '../../../constants/contacts'

export function getContactsTags() {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_CONTACTS_TAGS_REQUEST
      })

      const responseBody = await fetchContactsTags()
      const { data, info } = responseBody
      const tags = normalize({ tags: data }, tagsSchema)
      const response = {
        info,
        ...tags
      }

      dispatch({
        response,
        type: actionTypes.FETCH_CONTACTS_TAGS_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.FETCH_CONTACTS_TAGS_FAILURE
      })
      throw error
    }
  }
}

export default getContactsTags
