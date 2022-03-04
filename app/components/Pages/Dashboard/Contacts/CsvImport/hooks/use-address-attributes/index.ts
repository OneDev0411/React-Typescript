import { IAttribute } from '../../types'
import { useAttributeDefinition } from '../use-attribute-definition'
import { useAttributes } from '../use-attributes'

const AddressSectionName = 'Addresses'

export function useAddressAttributes() {
  const attributes = useAttributes()
  const getAttributeDefinition = useAttributeDefinition()

  const getAddressAttributes = (): IAttribute[] => {
    return attributes.filter(attribute => isAddressAttribute(attribute))
  }

  const isAddressAttribute = (attribute: IAttribute) => {
    const definition = getAttributeDefinition(attribute)

    return definition?.section === AddressSectionName
  }

  return { getAddressAttributes, isAddressAttribute }
}
