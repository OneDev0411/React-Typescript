import _ from 'underscore'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function attributeDeleted(id, contact) {
  return {
    type: types.DELETE_ATTRIBUTE,
    id,
    contact
  }
}

export function deleteAttribute(id, attribute_id) {
  return async (dispatch) => {
    try {
      const contact = await Contact.deleteAttribute(id, attribute_id)
      dispatch(attributeDeleted(id, contact))
    } catch(e) { /* nothing */ }
  }
}
