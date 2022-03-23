import { useCallback, useMemo } from 'react'

import Fuse from 'fuse.js'

import {
  IAttribute,
  AttributeOption,
  MappedField,
  IContactAttributeType
} from '../../../types'
import { useAttributeDefinition } from '../../use-attribute-definition'
import { useAttributes } from '../../use-attributes'
import { useIsAttributeDisabled } from '../../use-is-attribute-disabled'
import { useAddressOptions } from '../use-address-options'
import { usePartnerOptions } from '../use-partner-options'

export function useOptions(
  fields: Record<string, Nullable<MappedField>>,
  searchTerm: string
) {
  const attributes: IAttribute[] = useAttributes()
  const getAttributeDefinition = useAttributeDefinition()
  const partnerOptions = usePartnerOptions()
  const addressOptions = useAddressOptions(fields)
  const isAttributeDisabled = useIsAttributeDisabled()

  const getOptions = useCallback((): AttributeOption[] => {
    const list = attributes
      .filter(attribute => {
        const definition = getAttributeDefinition(attribute)

        return definition.show || definition.editable
      })
      .map(attribute => {
        const definition = getAttributeDefinition(attribute)

        const option: AttributeOption = {
          ...attribute,
          index: 0,
          disabled: false,
          label: definition.label
        }

        if (attribute.type === 'attribute_type') {
          option.multiValued = (definition as IContactAttributeType).multivalued
        }

        return option
      })

    return [...list, ...addressOptions, ...partnerOptions].map(option => {
      return {
        ...option,
        disabled: isAttributeDisabled(fields, option)
      }
    }) as AttributeOption[]
  }, [
    fields,
    attributes,
    isAttributeDisabled,
    getAttributeDefinition,
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
