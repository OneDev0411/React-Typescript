import types from '../../constants/brandConsole'

export default (state = [], action) => {
  switch (action.type) {

    case types.GET_CHECKLISTS:
      if (action.checklists) {
        return action.checklists
      }
      return state
    case types.ADD_CHECKLIST:
      return state.concat(action.checklist)
    case types.DELETE_CHECKLIST: {
      let stateClone = state.slice()
      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.checklist_id) {
          stateClone.splice(i, 1)
          break
        }
      }
      return stateClone
    }
    case types.ADD_TASK: {
      let stateClone = state.slice()
      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.checklist.id) {
          stateClone[i] = action.checklist
          break
        }
      }
      return stateClone
    }
    default:
      return state
  }
}
