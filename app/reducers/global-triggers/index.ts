import type {
  RequestGlobalTriggersFailedAction,
  RequestGlobalTriggersAction,
  SetGlobalTriggersAction,
  SetGlobalTriggerAction
} from 'actions/global-triggers'
import * as actionType from 'constants/global-triggers'

export interface IGlobalTriggerState {
  attrs: Record<
    TriggerContactEventTypes,
    IGlobalTrigger<'template' | 'template_instance'>
  >
  isLoading: boolean
}

const defaultGlobalTriggersState: IGlobalTriggerState = {
  attrs: {} as IGlobalTriggerState['attrs'],
  isLoading: false
}

function globalTriggersReducer(
  state: IGlobalTriggerState = defaultGlobalTriggersState,
  action:
    | SetGlobalTriggerAction
    | SetGlobalTriggersAction
    | RequestGlobalTriggersAction
    | RequestGlobalTriggersFailedAction
) {
  switch (action.type) {
    case actionType.REQUEST_GLOBAL_TRIGGERS:
      return {
        ...state,
        isLoading: true
      }
    case actionType.SET_GLOBAL_TRIGGERS:
      return {
        attrs: action.payload,
        isLoading: false
      }
    case actionType.SET_GLOBAL_TRIGGER:
      return {
        ...state,
        attrs: {
          ...state.attrs,
          [action.payload.event_type]: action.payload
        }
      }
    case actionType.REQUEST_GLOBAL_TRIGGERS_FAILED:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}

export default globalTriggersReducer
