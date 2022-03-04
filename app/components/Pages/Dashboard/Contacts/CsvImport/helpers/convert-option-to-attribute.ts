import { AttributeOption, IAttribute } from '../types'

export function convertOptionToAttribute(
  option: AttributeOption
): Nullable<IAttribute> {
  let field: Nullable<IAttribute> = null

  if (option.type === 'attribute_def') {
    field = {
      type: option.type,
      attribute_def: option.attribute_def
    }
  }

  if (option.type === 'attribute_type') {
    field = {
      type: option.type,
      attribute_type: option.attribute_type
    }
  }

  return field
}
