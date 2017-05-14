import _ from 'underscore'
import Contact from '../../models/Contact'
import types from '../../constants/contact'

function deleteAttribute (id, contact) {
  return {
    type: types.DELETE_ATTRIBUTE,
    id,
    contact
  }
}

export default function (user, id, attribute_id) {
  const params = {
    id,
    attribute_id,
    access_token: user.access_token,
  }

  return async (dispatch) => {
    try {
      const response = await Contact.deleteAttribute(params)
      dispatch(deleteAttribute(id, response.body.data))
    } catch(e) { /* nothing */ }
  }
}
