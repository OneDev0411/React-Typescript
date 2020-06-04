export type FilterTypes = 'radius' | 'custom'

export interface Filter {
  type: FilterTypes
  radius?: number
  areas?: Array<Array<number>>
}
