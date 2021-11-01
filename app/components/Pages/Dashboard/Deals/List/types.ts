export interface ClosingsFilterQuery {
  query: string
  contexts: {
    closing_date: {
      date: {
        from: string
        to: string
      }
    }
  }
  status: {
    is_archived: boolean
    is_null: boolean
  }
}
