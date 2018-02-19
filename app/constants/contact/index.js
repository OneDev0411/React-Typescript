const ActionTypes = {}

new Array('UPSERT_ATTRIBUTES').forEach(action => {
  ActionTypes[action] = `CONTACTS___${action}`
})

export default ActionTypes
