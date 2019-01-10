import { normalize } from 'normalizr'

import * as actionTypes from '../../../constants/contacts'
import { tagsSchema } from '../../../models/contacts/schema'
import { getContactsTags as fetchTags } from '../../../models/contacts/get-contacts-tags'
import { viewAs } from '../../../utils/user-teams'

export function getContactsTags(user_filter) {
  return async (dispatch, getState) => {
    if (!user_filter) {
      user_filter = viewAs(getState().user)
    }

    try {
      dispatch({
        type: actionTypes.FETCH_CONTACTS_TAGS_REQUEST
      })

      const responseBody = await fetchTags(user_filter)
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
