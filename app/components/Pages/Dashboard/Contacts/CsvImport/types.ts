export type AttributeType = 'attribute_def' | 'attribute_type'

export type CsvImportAttributeDefinition = {
  type: 'attribute_def'
  attribute_def: UUID
  index?: number
}

export type CsvImportAttributeType = {
  type: 'attribute_type'
  attribute_type: string
  label: string
  section: string
  singular?: string
  index?: number
}

export type IAttribute = CsvImportAttributeDefinition | CsvImportAttributeType

interface BaseAttributeOption {
  label: string
  index?: number
  disabled: boolean
}

interface AttributeDefinitionOption extends BaseAttributeOption {
  type: 'attribute_def'
  attribute: CsvImportAttributeDefinition
}

interface AttributeTypeOption extends BaseAttributeOption {
  type: 'attribute_type'
  attribute: CsvImportAttributeType
}

export type AttributeOption = AttributeDefinitionOption | AttributeTypeOption
