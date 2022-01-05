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
    (attribute: IAttribute, index: number) => {
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

        return isEqual && field.index === index
      })
    },
    [getAttributeDefinition, isAddressAttribute, fields]
  )

  const getOptions = useCallback((): AttributeOption[] => {
    const list = attributes
      .filter(attribute => {
        const definition = getAttributeDefinition(attribute)

        return definition.show || definition.editable
      })
      .map(attribute => {
        const definition = getAttributeDefinition(attribute)

        return {
          index: 0,
          disabled: false,
          label: definition.label,
          ...attribute
        }
      })

    return [...list, ...addressOptions, ...partnerOptions].map(option => {
      const attribute = {
        type: option.type,
        attributeTypeName:
          option.type === 'attribute_type' && option.attributeTypeName,
        attributeDefId: option.type === 'attribute_def' && option.attributeDefId
      } as IAttribute

      return {
        ...option,
        disabled: isAttributeDisabled(attribute, option.index)
      }
    }) as AttributeOption[]
  }, [
    attributes,
    getAttributeDefinition,
    isAttributeDisabled,
    addressOptions,
    partnerOptions
  ])

  return useMemo(() => {
    const list = getOptions()

    return searchTerm
      ? new Fuse(list, {
          threshold: 0.2,
          isCaseSensitive: false,
          keys: ['label']
        }).search(searchTerm)
      : list
  }, [searchTerm, getOptions])
}
