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
    attribute_type: 'full_address',
    label: 'Full Address',
    section: 'Addresses'
  }
]

export function useAttributes(): IAttribute[] {
  const attributeDefinitions = useSelector<
    IAppState,
    CsvImportAttributeDefinition[]
  >(({ contacts }) =>
    Object.values(contacts.attributeDefs.byId).map(({ id }) => ({
      type: 'attribute_def',
      attribute_def: id
    }))
  )

  return [...attributeDefinitions, ...AttributeTypes] as IAttribute[]
}
