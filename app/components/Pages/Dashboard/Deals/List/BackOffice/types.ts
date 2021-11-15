export interface SearchQuery {
  filter: string
  type: 'query' | 'inbox'
  term: string
}

export interface DealsListFilters {
  deal_type?: IDealType[]
  status?: {
    is_active: boolean
    is_closed: boolean
    is_pending: boolean
    is_archived: boolean
    is_null: boolean
  }
}

export type DealsOrder = [string, 'ASC' | 'DESC']
export interface DealsListPayload extends DealsListFilters {
  query?: string
  $order?: DealsOrder
}
