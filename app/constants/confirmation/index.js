const ActionTypes = {}

// eslint-disable-next-line no-array-constructor
new Array('SHOW_CONFIRMATION', 'HIDE_CONFIRMATION').forEach(action => {
  ActionTypes[action] = `DEALS___${action}`
})

export default ActionTypes
