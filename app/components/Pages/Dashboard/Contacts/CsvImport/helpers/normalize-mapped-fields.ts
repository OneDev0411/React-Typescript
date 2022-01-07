import type { MappedField } from '../types'

function normalize(field: Nullable<MappedField>) {
  if (!field) {
    return null
  }

  const data = {
    index: field.index,
    label: field.label,
    is_partner: field.isPartner
  }

  if (field.type === 'attribute_def') {
    return {
      ...data,
      definition_id: field.attributeDefId
    }
  }

  if (field.type === 'attribute_type') {
    return {
      ...data,
      attribute_type: field.attributeTypeName
    }
  }

  return null
}

export function normalizeMappedFields(
  fields: Record<string, Nullable<MappedField>>
) {
  return Object.entries(fields).reduce((list, [column, field]) => {
    const normalized = normalize(field)

    return normalized
      ? {
          ...list,
          [column]: normalized
        }
      : list
  }, {})
}
