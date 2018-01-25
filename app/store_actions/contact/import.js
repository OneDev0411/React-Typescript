import types from '../../constants/contact'

export function loginSusseful() {
  return dispatch({ type: types.IMPORT_SUCCESSFUL_LOGIN })
}

export function importDone() {
  return dispatch({ type: types.IMPORT_DONE })
}
