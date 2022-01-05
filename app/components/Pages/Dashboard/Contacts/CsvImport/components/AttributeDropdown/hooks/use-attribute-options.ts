import { useCallback, useMemo } from 'react'

import Fuse from 'fuse.js'

import { isAttributesEqual } from '../../../helpers/is-attributes-equal'
import { useAddressAttributes } from '../../../hooks/use-address-attributes'
import { useAttributeDefinition } from '../../../hooks/use-attribute-definition'
import { useAttributes } from '../../../hooks/use-attributes'
import { IAttribute, AttributeOption, MappedField } from '../../../types'

import { useAddressOptions } from './use-address-options'
import { usePartnerOptions } from './use-partner-options'

export function useOptions(
  fields: Record<string, MappedField>,
  searchTerm: string
) {
  const attributes: IAttribute[] = useAttributes()
  const getAttributeDefinition = useAttributeDefinition()
  const partnerOptions = usePartnerOptions()
  const addressOptions = useAddressOptions(fields)

  const { isAddressAttribute } = useAddressAttributes()

  const isAttributeDisabled = useCallback(
    (attribute: IAttribute) => {
      const isSingular = (attribute: IAttribute) =>
        getAttributeDefinition(attribute).singular

      if (
        isAddressAttribute(attribute) === false &&
        isSingular(attribute) === false
      ) {
        return false
      }

      return Object.values(fields).some(field => {
        const isEqual = isAttributesEqual(field, attribute)

        if (isSingular(attribute) && isEqual) {
          return true
        }

        return isEqual && field.index === attribute.index
      })
    },
    [getAttributeDefinition, isAddressAttribute, fields]
  )

  const getBaseOptions = useCallback((): AttributeOption[] => {
    const list = attributes
      .filter(attribute => {
        const definition = getAttributeDefinition(attribute)

        return definition.show || definition.editable
      })
      .map(attribute => {
        const definition = getAttributeDefinition(attribute)

        return {
          disabled: isAttributeDisabled(attribute),
          label: definition.label,
          ...attribute
        }
      })

    return list as AttributeOption[]
  }, [attributes, getAttributeDefinition, isAttributeDisabled])

  return useMemo(() => {
    const list = [...getBaseOptions(), ...addressOptions, ...partnerOptions]

    return searchTerm
      ? new Fuse(list, {
          threshold: 0.2,
          isCaseSensitive: false,
          keys: ['label']
        }).search(searchTerm)
      : list
  }, [searchTerm, getBaseOptions, addressOptions, partnerOptions])
}
