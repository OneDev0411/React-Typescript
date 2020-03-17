export enum InsightFiltersType {
  SCHEDULED = 'scheduled',
  SENT = 'sent'
}

export enum ActionGeneralTypes {
  FETCH_REQUEST = 'FETCH_REQUEST',
  FETCH_SUCCESS = 'FETCH_SUCCESS',
  FETCH_FAILED = 'FETCH_FAILED'
}

type ActionRequestPayload = {
  isLoading: boolean
  activeFilter: InsightFiltersType
}
type ActionSuccessPayload = {
  isLoading: boolean
  list: IEmailCampaign[]
  stats: {
    scheduled: number
    sent: number
  }
}
type ActionFailedPayload = {
  isLoading: boolean
  hasError: boolean
}

export interface ActionTypes {
  type: ActionGeneralTypes
  payload: ActionRequestPayload | ActionSuccessPayload | ActionFailedPayload
}

export interface ListDataTypes {
  isLoading: boolean
  hasError: boolean
  list: IEmailCampaign[]
  stats: {
    scheduled: number
    sent: number
  }
  activeFilter: InsightFiltersType | null
}
