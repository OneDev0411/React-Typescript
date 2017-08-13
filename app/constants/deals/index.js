import deals from './deals'
import forms from './forms'

const ActionTypes = {}

new Array(
  ...deals,
  ...forms
)
.forEach(action => {
  ActionTypes[action] = `DEALS___${action}`
})

export default ActionTypes
