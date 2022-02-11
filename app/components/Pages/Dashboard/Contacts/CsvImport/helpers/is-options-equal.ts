import { AttributeOption, MappedField } from '../types'

export function isOptionsEqual(field: MappedField, option: AttributeOption) {
  if (field.type !== option.type) {
    return false
  }

  if (field.type === 'attribute_type' && option.type === 'attribute_type') {
    return (
      field.attribute_type === option.attribute_type &&
      field.isPartner === option.isPartner
    )
  }

  if (field.type === 'attribute_def' && option.type === 'attribute_def') {
    return (
      field.attribute_def === option.attribute_def &&
      field.isPartner === option.isPartner
    )
  }

  return false
}
