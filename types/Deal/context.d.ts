declare interface IDealBrandContext {
  id: UUID
  brand: UUID
  key: string
  label: string
  short_label: string
  section: string
  needs_approval: boolean
  exports: boolean
  preffered_source: string
  default_value: unknown
  data_type: 'Number' | 'Date' // TODO: double check with Emil
  format: unknown
  optional: string[]
  required: string[]
  triggers_brokerwolf: boolean
  order: number
  type: string
}
