export interface SearchQuery {
  filter: string
  type: 'query' | 'inbox'
  term: string
}
