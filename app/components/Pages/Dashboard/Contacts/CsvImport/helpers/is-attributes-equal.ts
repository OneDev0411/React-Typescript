import { IAttribute } from '../types'

export function isAttributesEqual(attr1: IAttribute, attr2: IAttribute) {
  if (attr1.type !== attr2.type) {
    return false
  }

  if (attr1.type === 'attribute_type' && attr2.type === 'attribute_type') {
    return attr1.attribute_type === attr2.attribute_type
  }

  if (attr1.type === 'attribute_def' && attr2.type === 'attribute_def') {
    return attr1.attribute_def === attr2.attribute_def
  }

  return false
}
