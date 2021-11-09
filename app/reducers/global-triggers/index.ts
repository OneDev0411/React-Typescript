import type {
  RequestGlobalTriggersAction,
  SetGlobalTriggersAction
} from 'actions/global-triggers'
import * as actionType from 'constants/global-triggers'

export interface IGlobalTriggerState {
  attrs: Record<TriggerContactEventTypes, IGlobalTrigger>
  isLoading: boolean
}

const defaultGlobalTriggersState: IGlobalTriggerState = {
  attrs: {} as IGlobalTriggerState['attrs'],
  isLoading: false
}

function globalTriggersReducer(
  state: IGlobalTriggerState = defaultGlobalTriggersState,
  action: SetGlobalTriggersAction | RequestGlobalTriggersAction
) {
  switch (action.type) {
    case actionType.REQUEST_GLOBAL_TRIGGERS:
      return {
        ...state,
        isLoading: true
      }
    case actionType.SET_GLOBAL_TRIGGERS: {
      return {
        attrs: action.payload,
        isLoading: false
      }
    }
    default:
      return state
  }
}

export default globalTriggersReducer
