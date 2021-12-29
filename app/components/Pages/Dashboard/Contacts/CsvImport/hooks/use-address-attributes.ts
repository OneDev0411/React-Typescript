import { CsvImportAttributeDefinition, IAttribute } from '../types'

import { useAttributeDefs } from './use-attribute-defs'
import { useAttributes } from './use-attributes'

const AddressSectionName = 'Addresses'

export function useAddressAttributes() {
  const attributes = useAttributes()
  const { byId, bySection } = useAttributeDefs()

  const getAddressAttributes = (): IAttribute[] => {
    return attributes.filter(attribute => {
      return attribute.type === 'attribute_type'
        ? attribute.section === AddressSectionName
        : byId[attribute.attribute_def].section === AddressSectionName
    })
  }

  const isAddressAttribute = (attribute: IAttribute) => {
    if (
      attribute.type === 'attribute_type' &&
      attribute.section === AddressSectionName
    ) {
      return true
    }

    return bySection[AddressSectionName].some(
      id => id === (attribute as CsvImportAttributeDefinition).attribute_def
    )
  }

  return { getAddressAttributes, isAddressAttribute }
}
