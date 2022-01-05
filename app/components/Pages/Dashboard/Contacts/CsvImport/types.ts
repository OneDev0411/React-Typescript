export type AttributeType = 'attribute_def' | 'attribute_type'

export declare interface IContactAttributeType {
  name: string
  label: string
  section: string
  show: boolean
  editable?: boolean
  singular: boolean
}

export type CsvImportAttributeDefinition = {
  type: 'attribute_def'
  attributeDefId: UUID
}

export type CsvImportAttributeType = {
  type: 'attribute_type'
  attributeTypeName: string
}

export type IAttribute = CsvImportAttributeDefinition | CsvImportAttributeType

interface BaseAttributeOption {
  label: string
  index?: number
  disabled: boolean
  isPartner?: boolean
}

export type AttributeDefinitionOption = BaseAttributeOption &
  CsvImportAttributeDefinition

export type AttributeTypeOption = BaseAttributeOption & CsvImportAttributeType

export type AttributeOption = AttributeDefinitionOption | AttributeTypeOption

export type MappedField = {
  index?: number
} & IAttribute
