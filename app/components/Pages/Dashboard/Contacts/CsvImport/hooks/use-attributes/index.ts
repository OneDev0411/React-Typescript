import type { CsvImportAttributeType, IAttribute } from '../../types'
import { useAttributeDefs } from '../use-attribute-defs'

const AttributeTypes: CsvImportAttributeType[] = [
  {
    type: 'attribute_type',
    attribute_type: 'full_address'
  },
  {
    type: 'attribute_type',
    attribute_type: 'tag'
  }
]

export function useAttributes(): IAttribute[] {
  const { list } = useAttributeDefs()

  const attributeDefinitions = (list ?? []).map(({ id }) => ({
    type: 'attribute_def',
    attribute_def: id
  }))

  return [...attributeDefinitions, ...AttributeTypes] as IAttribute[]
}
