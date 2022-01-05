import { maxBy } from 'lodash'

import { useAddressAttributes } from '../../../hooks/use-address-attributes'
import { useAttributeDefinition } from '../../../hooks/use-attribute-definition'
import type { AttributeOption, MappedField } from '../../../types'

export function useAddressOptions(
  fields: Record<string, MappedField>
): AttributeOption[] {
  const { isAddressAttribute, getAddressAttributes } = useAddressAttributes()
  const getAttributeDefinition = useAttributeDefinition()

  const getLastAddressIndex = () => {
    const addressFields = Object.values(fields).filter(isAddressAttribute)

    if (addressFields.length === 0) {
      return 0
    }

    const attribute = maxBy(addressFields, attribute => attribute.index ?? 0)

    return parseInt(attribute.index ?? 0, 10) + 1
  }

  const last = getLastAddressIndex()

  if (last === 0) {
    return []
  }

  return new Array(last).fill(null).flatMap((_, index) =>
    getAddressAttributes().map(attribute => {
      const definition = getAttributeDefinition(attribute)

      return {
        index: 0,
        ...attribute,
        isPartner: false,
        disabled: false,
        label: definition.label
      } as AttributeOption
    })
  )
}
