export enum InsightFilterType {
  SCHEDULED = 'scheduled',
  SENT = 'sent'
}

export interface InsightState {
  isLoading: boolean
  hasError: boolean
  list: IEmailCampaign[]
  counts: {
    scheduled: number
    sent: number
  }
}

export enum InsightActionType {
  FetchListRequest = 'FetchListRequest',
  FetchListSuccess = 'FetchListSuccess',
  FetchListFailure = 'FetchListFailure',
  FetchItemRequest = 'FetchItemRequest',
  FetchItemSuccess = 'FetchItemSuccess',
  FetchItemFailure = 'FetchItemFailure'
}

export type InsightAction =
  | {
      type: InsightActionType.FetchListRequest
    }
  | {
      type: InsightActionType.FetchListSuccess
      allEmailCampaigns: readonly IEmailCampaign[]
      filterType: InsightFilterType
    }
  | {
      type: InsightActionType.FetchListFailure
    }
  | {
      type: InsightActionType.FetchItemRequest
    }
  | {
      type: InsightActionType.FetchItemSuccess
      emailCampaign: IEmailCampaign
    }
  | {
      type: InsightActionType.FetchItemFailure
    }
