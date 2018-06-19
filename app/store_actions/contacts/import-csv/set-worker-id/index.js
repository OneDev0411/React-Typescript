import * as types from '../../../../constants/contacts'

export function setWorkerId(id) {
  return {
    type: types.CONTACTS__IMPORT_CSV__SET_WORKER_ID,
    id
  }
}
