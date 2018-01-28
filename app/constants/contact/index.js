const ActionTypes = {}

new Array(
  'ADD_CONTACT',
  'GET_CONTACTS',
  'UPDATE_CONTACT',
  'GET_TAGS',
  'ADD_NOTE',
  'GET_TIMELINE',
  'UPSERT_ATTRIBUTES',
  'DELETE_ATTRIBUTE',
  'IMPORT_SUCCESSFUL_LOGIN',
  'IMPORT_DONE',
  'UPLOAD_CVS'
).forEach(action => {
  ActionTypes[action] = `CONTACTS___${action}`
})

export default ActionTypes
