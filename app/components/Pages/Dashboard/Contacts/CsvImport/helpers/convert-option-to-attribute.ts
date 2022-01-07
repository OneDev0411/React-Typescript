import { AttributeOption, IAttribute } from '../types'

export function convertOptionToAttribute(
  option: AttributeOption
): Nullable<IAttribute> {
  let field: Nullable<IAttribute> = null

  if (option.type === 'attribute_def') {
    field = {
      type: option.type,
      attributeDefId: option.attributeDefId
    }
  }

  if (option.type === 'attribute_type') {
    field = {
      type: option.type,
      attributeTypeName: option.attributeTypeName
    }
  }

  return field
}
