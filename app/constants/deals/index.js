import deals from './deals'

const ActionTypes = {}

new Array(
  ...deals
)
.forEach(action => {
  ActionTypes[action] = `DEALS___${action}`
})

export default ActionTypes
