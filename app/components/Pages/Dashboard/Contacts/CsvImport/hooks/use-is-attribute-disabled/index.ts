import { useCallback } from 'react'

import { convertOptionToAttribute } from '../../helpers/convert-option-to-attribute'
import { isOptionsEqual } from '../../helpers/is-options-equal'
import { AttributeOption, IAttribute, MappedField } from '../../types'
import { useAddressAttributes } from '../use-address-attributes'
import { useAttributeDefinition } from '../use-attribute-definition'

export function useIsAttributeDisabled() {
  const getAttributeDefinition = useAttributeDefinition()
  const { isAddressAttribute } = useAddressAttributes()

  return useCallback(
    (
      fields: Record<string, Nullable<MappedField>>,
      option: AttributeOption
    ) => {
      if (Object.values(fields).length === 0 || !option) {
        return false
      }

      const attribute: Nullable<IAttribute> = convertOptionToAttribute(option)

      if (!attribute) {
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
          const isEqual = isOptionsEqual(field, option)

          if (isSingular(attribute) && isEqual) {
            return true
          }

          return isEqual && field.index === option.index
        })
    },
    [getAttributeDefinition, isAddressAttribute]
  )
}
