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

export interface ActionTypes {
  type: ActionGeneralTypes
  payload: ActionRequestPayload | ActionSuccessPayload
}

export interface ListDataTypes {
  isLoading: boolean
  list: IEmailCampaign[]
  stats: {
    scheduled: number
    sent: number
  }
  activeFilter: InsightFiltersType | null
}
