import _ from 'underscore'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function upsertAttributes (id, contact) {
  return {
    type: types.UPSERT_ATTRIBUTES,
    id,
    contact
  }
}

export default function (id, type, attributes) {
  const defaultParams = {
    id,
    type
  }

  const updates = _.filter(attributes, attr => attr.id)
  const inserts = _.filter(attributes, attr => !attr.id)

  let response
  let params

  return async (dispatch) => {

    // insert attributes
    if (inserts.length > 0) {
      params = {
        ...defaultParams,
        ...{attributes: inserts}
      }

      try {
        // send save request
        response = await Contact.createAttributes(params)

        // dispatch
        dispatch(upsertAttributes(id, response.body.data))
      } catch(e) { /* nothing */}
    }

    // update attributes
    if (updates.length > 0) {
      params = {
        ...defaultParams,
        ...{attributes: updates}
      }

      try {
        // send save request
        response = await Contact.updateAttributes(params)

        // dispatch
        dispatch(upsertAttributes(id, response.body.data))

      } catch(e) { /* nothing */}
    }
  }
}
