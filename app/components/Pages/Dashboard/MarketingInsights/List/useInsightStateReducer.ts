import { InsightAction, InsightActionType, InsightState } from './types'
import { filterInsightList } from './helpers'

export const initialState: InsightState = {
  isLoading: false,
  hasError: false,
  list: [],
  counts: {
    scheduled: 0,
    sent: 0
  }
}

export function useInsightStateReducer(
  state: InsightState,
  action: InsightAction
): InsightState {
  switch (action.type) {
    case InsightActionType.FetchListRequest:
      return {
        ...state,
        isLoading: true,
        hasError: false
      }

    case InsightActionType.FetchListSuccess:
      return {
        ...state,
        isLoading: false,
        ...filterInsightList(action.allEmailCampaigns, action.filterType)
      }

    case InsightActionType.FetchListFailure:
      return {
        ...state,
        isLoading: false,
        hasError: true
      }

    case InsightActionType.FetchItemRequest:
      return {
        ...state,
        isLoading: false,
        hasError: false
      }

    case InsightActionType.FetchItemSuccess:
      return {
        ...state,
        list: state.list.map(item =>
          item.id === action.emailCampaign.id ? action.emailCampaign : item
        )
      }

    case InsightActionType.FetchItemFailure:
      return {
        ...state,
        hasError: true
      }

    default:
      return state
  }
}
