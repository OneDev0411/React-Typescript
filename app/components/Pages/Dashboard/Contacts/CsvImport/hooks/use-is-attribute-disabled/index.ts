import { useCallback } from 'react'

import { isAttributesEqual } from '../../helpers/is-attributes-equal'
import { IAttribute, MappedField } from '../../types'
import { useAddressAttributes } from '../use-address-attributes'
import { useAttributeDefinition } from '../use-attribute-definition'

export function useIsAttributeDisabled() {
  const getAttributeDefinition = useAttributeDefinition()
  const { isAddressAttribute } = useAddressAttributes()

  return useCallback(
    (
      fields: Record<string, Nullable<MappedField>>,
      attribute: IAttribute,
      index: number
    ) => {
      if (Object.values(fields).length === 0 || !attribute) {
        return false
      }

      const isSingular = (attribute: IAttribute) =>
        getAttributeDefinition(attribute).singular

      if (
        isAddressAttribute(attribute) === false &&
        isSingular(attribute) === false
      ) {
        return false
      }

      return Object.values(fields)
        .filter(field => !!field)
        .some((field: MappedField) => {
          const isEqual = isAttributesEqual(field, attribute)

          if (isSingular(attribute) && isEqual) {
            return true
          }

          return isEqual && field.index === index
        })
    },
    [getAttributeDefinition, isAddressAttribute]
  )
}
