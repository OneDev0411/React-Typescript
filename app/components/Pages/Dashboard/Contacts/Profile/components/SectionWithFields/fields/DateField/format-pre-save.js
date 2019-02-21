import { parseNumberAttribute } from '../helpers/parse-number-attribute'

export function formatPreSave(attribute, newValue) {
  const { attribute_def, id } = attribute
  const type = attribute_def.data_type

  if (newValue === attribute[type]) {
    return undefined
  }

  let result = {
    attribute_def,
    [type]: newValue
  }

  if (id) {
    result = {
      ...result,
      id
    }
  }

  return parseNumberAttribute(result)
}
