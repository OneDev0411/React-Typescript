import Contact from '../../models/Contact'
import types from '../../constants/contact'

function addNote (id, contact) {
  return {
    type: types.ADD_NOTE,
    id,
    contact
  }
}

export default function (id, note) {
  const params = {
    id,
    note
  }

  return async (dispatch) => {
    const response = await Contact.addNote(params)
    const contact = response.body.data
    dispatch(addNote(id, contact))
  }
}
