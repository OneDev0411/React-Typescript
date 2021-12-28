export type CsvImportAttributeDefinition = {
  type: 'attribute_def'
  attribute_def: UUID
}

export type CsvImportAttributeType = {
  type: 'attribute_type'
  attribute_type: string
}

export type IAttribute = CsvImportAttributeDefinition & CsvImportAttributeType
