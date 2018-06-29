import types from '../../constants/brandConsole'
import * as typesDeals from '../../constants/deals'

function cloneObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  let temp = obj.constructor() // give temp the original obj's constructor

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = cloneObject(obj[key])
    }
  }

  return temp
}

export default (state = [], action) => {
  switch (action.type) {
    case types.GET_CHECKLISTS:
      if (action.checklists) {
        return action.checklists
      }

      return state
    case types.ADD_CHECKLIST:
      return state.concat(action.checklist)
    case types.EDIT_CHECKLIST: {
      let stateClone = state.slice()

      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.checklist.id) {
          stateClone[i] = action.checklist
          break
        }
      }

      return stateClone
    }
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
    case typesDeals.ADD_FORM:
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
    case types.DELETE_TASK: {
      let stateClone = cloneObject(state)

      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.checklistId) {
          for (let j = 0; j < stateClone[i].tasks.length; j++) {
            if (stateClone[i].tasks[j].id === action.taskId) {
              stateClone[i].tasks.splice(j, 1)
              break
            }
          }

          break
        }
      }

      return stateClone
    }
    case typesDeals.DELETE_FORM: {
      let stateClone = cloneObject(state)

      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.checklistId) {
          for (let j = 0; j < stateClone[i].allowed_forms.length; j++) {
            if (stateClone[i].allowed_forms[j] === action.formId) {
              stateClone[i].allowed_forms.splice(j, 1)
              break
            }
          }

          break
        }
      }

      return stateClone
    }
    case types.EDIT_TASK: {
      let stateClone = cloneObject(state)

      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.checklistId) {
          for (let j = 0; j < stateClone[i].tasks.length; j++) {
            if (stateClone[i].tasks[j].id === action.task.id) {
              stateClone[i].tasks[j] = action.task
              break
            }
          }

          break
        }
      }

      return stateClone
    }
    default:
      return state
  }
}
