import * as actionTypes from '../../../constants/contacts'

export function removeContactFromList(id) {
  return dispatch => {
    dispatch({
      type: actionTypes.REMOVE_CONTACT_FROM_LIST,
      id
    })
  }
}

export default removeContactFromList
