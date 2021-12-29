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
