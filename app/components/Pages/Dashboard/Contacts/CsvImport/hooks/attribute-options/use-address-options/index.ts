import { maxBy } from 'lodash'

import type { AttributeOption, MappedField } from '../../../types'
import { useAddressAttributes } from '../../use-address-attributes'
import { useAttributeDefinition } from '../../use-attribute-definition'

export function useAddressOptions(
  fields: Record<string, Nullable<MappedField>>
): AttributeOption[] {
  const { isAddressAttribute, getAddressAttributes } = useAddressAttributes()
  const getAttributeDefinition = useAttributeDefinition()

  const getLastAddressIndex = () => {
    const addressFields = Object.values(fields).filter(
      field => !!field && isAddressAttribute(field)
    ) as MappedField[]

    if (addressFields.length === 0) {
      return 0
    }

    const attribute = maxBy(addressFields, attribute => attribute.index ?? 0)!

    return Number(attribute.index ?? 0) + 1
  }

  const last = getLastAddressIndex()

  if (last === 0) {
    return []
  }

  return new Array(last).fill(null).flatMap((_, index) =>
    getAddressAttributes().map(attribute => {
      const definition = getAttributeDefinition(attribute)

      return {
        ...attribute,
        index: index + 1,
        isPartner: false,
        disabled: false,
        label:
          index >= 0 ? `${definition.label} ${index + 1}` : definition.label
      } as AttributeOption
    })
  )
}
