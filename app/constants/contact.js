const ActionTypes = {}

new Array(
  'ADD_CONTACT',
  'GET_CONTACTS',
  'GET_TAGS',
  'ADD_NOTE',
  'GET_TIMELINE',
  'UPSERT_ATTRIBUTES',
  'DELETE_ATTRIBUTE'
)
.forEach(action => {
  ActionTypes[action] = `CONTACTS___${action}`
})

export default ActionTypes
