export type AttributeType = 'attribute_def' | 'attribute_type'

export declare interface IContactAttributeType {
  name: string
  label: string
  section?: string
  show: boolean
  editable?: boolean
  singular: boolean
  labels: string[]
  multivalued?: boolean
}

export type CsvImportAttributeDefinition = {
  type: 'attribute_def'
  attribute_def: UUID
}

export type CsvImportAttributeType = {
  type: 'attribute_type'
  attribute_type: string
}

export type IAttribute = CsvImportAttributeDefinition | CsvImportAttributeType

interface BaseAttributeOption {
  label: string
  index: number
  disabled: boolean
  isPartner?: boolean
  multiValued?: boolean
}

export type AttributeDefinitionOption = BaseAttributeOption &
  CsvImportAttributeDefinition
export type AttributeTypeOption = BaseAttributeOption & CsvImportAttributeType

export type AttributeOption = AttributeDefinitionOption | AttributeTypeOption

export type MappedField = {
  index?: number
  label?: string
  isPartner?: boolean
  multiValued?: boolean
} & IAttribute
