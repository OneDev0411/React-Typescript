import { DEALS_STATUSES } from './constants'

export interface SearchQuery {
  filter: string
  type: 'query' | 'inbox'
  term: string
}

export type TDealsStatus = keyof typeof DEALS_STATUSES

export type TDateRange = { from: string; to: string }
export type DealsListContext = { date: Partial<TDateRange> }
export type TDealsStatusList = Partial<Record<TDealsStatus, boolean>>
export type TDealsContexts = {
  closing_date?: DealsListContext
  list_date?: DealsListContext
  expiration_date?: DealsListContext
  contract_date?: DealsListContext
}
export interface DealsListFilters {
  deal_type?: IDealType[]
  status: TDealsStatusList
  contexts: TDealsContexts
}

export type DealsOrder = [string, 'ASC' | 'DESC']
export interface DealsListPayload extends DealsListFilters {
  query?: string
  $order?: DealsOrder
}

export interface StateProps {
  user: IUser
  isFetchingDeals: boolean
  getDeals(user: IUser): void
  searchDeals(user: IUser, value: object | string): void
}
