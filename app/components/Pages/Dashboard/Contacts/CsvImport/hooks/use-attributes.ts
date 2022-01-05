import { useSelector } from 'react-redux'

import type { IAppState } from '@app/reducers'

import type {
  CsvImportAttributeDefinition,
  CsvImportAttributeType,
  IAttribute
} from '../types'

const AttributeTypes: CsvImportAttributeType[] = [
  {
    type: 'attribute_type',
    attributeTypeName: 'full_address'
  }
]

export function useAttributes(): IAttribute[] {
  const attributeDefinitions = useSelector<
    IAppState,
    CsvImportAttributeDefinition[]
  >(({ contacts }) =>
    Object.values(contacts.attributeDefs.byId).map(({ id }) => ({
      type: 'attribute_def',
      attributeDefId: id
    }))
  )

  return [...attributeDefinitions, ...AttributeTypes] as IAttribute[]
}
