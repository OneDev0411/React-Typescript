import types from '../../constants/contact'

export function updateContact (contact) {
  return {
    type: types.UPDATE_CONTACT,
    contact
  }
}
