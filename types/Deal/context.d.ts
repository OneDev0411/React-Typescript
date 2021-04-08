declare type IContextSection = 'Listing' | 'CDA' | 'Dates' | null
declare type IContextSource = 'Provided' | 'MLS' | null
declare type IContextDataType = 'Text' | 'Date' | 'Number' | null
declare type IContextFormat = 'Currency' | null
declare type IContextCondition = IDealType | IDealPropertyType

declare interface IDealBrandContext {
  id: UUID
  brand: UUID
  key: string
  type: 'brand_context'
  label: string
  mandatory: boolean
  short_label: string | null
  section: IContextSection
  needs_approval: boolean | null
  exports: boolean | null
  preffered_source: IContextSource
  default_value: string | null
  data_type: IContextDataType
  format: IContextFormat
  required: Array<IContextCondition> | null
  optional: Array<IContextCondition> | null
  triggers_brokerwolf: boolean
  order: number
  deleted_at?: number | null
  properties: {
    placeholder: string
    mask: string[]
  }
  validate: (context: IDealBrandContext, value: unknown) => boolean
}

declare interface IDealContext {
  definition: UUID
  checklist: UUID
  value: unknown
  approved: boolean
}
