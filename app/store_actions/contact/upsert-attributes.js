import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function attributesUpserted(id, contact) {
  return {
    type: types.UPSERT_ATTRIBUTES,
    id,
    contact
  }
}

function getErrorMessage(e) {
  return e.response ? e.response.body.attributes[type][0] : 'Field is not valid'
}

export function upsertAttributes (id, type, attributes) {
  const typeName = type.replace('_', ' ')

  const updates = _.filter(attributes, attr => attr.id)
  const inserts = _.filter(attributes, attr => !attr.id)

  let contact

  return async (dispatch) => {

    // insert attributes
    if (inserts.length > 0) {
      try {
        // send save request
        contact = await Contact.createAttributes(id, type, inserts)

        // dispatch
        dispatch(attributesUpserted(id, contact))

        dispatch(notify({
          message: `New ${typeName} created`,
          status: 'success'
        }))
      } catch(e) {
        dispatch(notify({
          title: `Can not create ${typeName}`,
          message: getErrorMessage(e),
          status: 'error'
        }))
      }
    }

    // update attributes
    if (updates.length > 0) {

      try {
        // send save request
        contact = await Contact.updateAttributes(id, type, updates)

        // dispatch
        dispatch(attributesUpserted(id, contact))

        dispatch(notify({
          message: `${typeName} updated`,
          status: 'success'
        }))

      } catch(e) {
        dispatch(notify({
          title: `Can not update ${typeName}`,
          message: getErrorMessage(e),
          status: 'error'
        }))
      }
    }
  }
}
