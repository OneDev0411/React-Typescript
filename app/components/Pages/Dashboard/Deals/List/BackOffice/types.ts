import { DEALS_STATUSES } from './constants'

export interface SearchQuery {
  filter: string
  type: 'query' | 'inbox'
  term: string
}

export type TDealsStatus = keyof typeof DEALS_STATUSES

export type TDealsStatusList = Partial<Record<TDealsStatus, boolean>>
export interface DealsListFilters {
  deal_type?: IDealType[]
  status: TDealsStatusList
}

export type DealsOrder = [string, 'ASC' | 'DESC']
export interface DealsListPayload extends DealsListFilters {
  query?: string
  $order?: DealsOrder
}
