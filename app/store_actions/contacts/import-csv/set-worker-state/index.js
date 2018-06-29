import * as types from '../../../../constants/contacts'

export function setWorkerState(state) {
  return {
    type: types.CONTACTS__IMPORT_CSV__SET_WORKER_STATE,
    state
  }
}
