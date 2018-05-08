import * as actionTypes from '../../../constants/contacts'
import { getAttributeDefs as fetchAttributeDefs } from '../../../models/contacts/get-attribute-defs'

export function getAttributeDefs() {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.FETCH_CONTACT_ATTR_DEFS_REQUEST
      })

      const definitions = await fetchAttributeDefs()

      dispatch({
        definitions,
        type: actionTypes.FETCH_CONTACT_ATTR_DEFS_SUCCESS
      })
    } catch (error) {
      dispatch({
        error,
        type: actionTypes.FETCH_CONTACT_ATTR_DEFS_FAILURE
      })
      throw error
    }
  }
}
