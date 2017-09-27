import Contact from '../../models/Contact'
import types from '../../constants/contact'

function noteCreated(id, contact) {
  return {
    type: types.ADD_NOTE,
    id,
    contact
  }
}

export function addNote(id, note) {
  return async (dispatch) => {
    const response = await Contact.addNote(id, note)
    const contact = response.body.data
    dispatch(noteCreated(id, contact))
  }
}
