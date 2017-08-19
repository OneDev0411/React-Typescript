import types from '../../constants/brandConsole'

export default (state = [], action) => {
  switch (action.type) {
    case types.ADD_TASK:
      return state.concat(action.task)
    case types.DELETE_TASK: {
      let stateClone = state.slice()
      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.task_id) {
          stateClone.splice(i, 1)
          break
        }
      }
      return stateClone
    }
    default:
      return state
  }
}
