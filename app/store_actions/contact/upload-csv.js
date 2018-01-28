import Contact from '../../models/Contact'
import types from '../../constants/contact'

function contactsFetched(contacts) {
  return {
    type: types.UPLOAD_CVS,
    contacts
  }
}

export function uplaodCsv(file, fileName = null) {
  return async dispatch => {
    try {
      const list = await Contact.uplaodCsv(file, fileName)

      dispatch(contactsFetched(list))
    } catch (e) {
      console.log(e)
    }
  }
}
