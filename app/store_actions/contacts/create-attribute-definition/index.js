import * as actionTypes from '../../../constants/contacts'
import { createAttributeDefinition as postAttributeDef } from '../../../models/contacts/create-attribute-definition'
import { selectDefinitions } from '../../../reducers/contacts/attributeDefs'

export function createAttributeDefinition(definition) {
  return async (dispatch, getState) => {
    if (definition == null) {
      const error = new Error(`definition is ${definition}`)

      console.error(error)

      return dispatch({
        error,
        type: actionTypes.CREATE_CONTACT_ATTR_DEF_FAILURE
      })
    }

    try {
      dispatch({
        type: actionTypes.CREATE_CONTACT_ATTR_DEF_REQUEST
      })

      const attribute_def = await postAttributeDef(definition)
      const definitions = [
        ...selectDefinitions(getState().contacts.attributeDefs),
        attribute_def
      ]

      dispatch({
        definitions,
        type: actionTypes.CREATE_CONTACT_ATTR_DEF_SUCCESS
      })

      return attribute_def
    } catch (error) {
      console.error(error)

      dispatch({
        error,
        type: actionTypes.CREATE_CONTACT_ATTR_DEF_FAILURE
      })
    }
  }
}
