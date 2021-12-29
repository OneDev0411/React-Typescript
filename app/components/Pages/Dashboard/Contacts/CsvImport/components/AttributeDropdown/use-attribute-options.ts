import { useCallback, useMemo } from 'react'

import Fuse from 'fuse.js'

import { isAttributesEqual } from '../../helpers/is-attributes-equal'
import { useAddressAttributes } from '../../hooks/use-address-attributes'
import { useAttributeDefs } from '../../hooks/use-attribute-defs'
import { useAttributes } from '../../hooks/use-attributes'
import { IAttribute, AttributeOption } from '../../types'

export function useOptions(
  fields: Record<string, IAttribute>,
  searchTerm: string
) {
  const attributes = useAttributes()
  const { byId: attributeDefsById } = useAttributeDefs()
  const { isAddressAttribute } = useAddressAttributes()

  const isAttributeDisabled = useCallback(
    (attribute: IAttribute) => {
      const getDefinition = (attribute: IAttribute) =>
        attribute.type === 'attribute_def'
          ? attributeDefsById[attribute.attribute_def]
          : null

      const isSingular = (attribute: IAttribute) =>
        attribute.type === 'attribute_type'
          ? attribute.singular
          : getDefinition(attribute)!.singular

      if (
        isAddressAttribute(attribute) === false &&
        isSingular(attribute) === false
      ) {
        return false
      }

      return Object.values(fields).some((field: IAttribute) => {
        const isEqual = isAttributesEqual(field, attribute)

        if (isSingular(attribute) && isEqual) {
          return true
        }

        return isEqual && field.index === attribute.index
      })
    },
    [attributeDefsById, isAddressAttribute, fields]
  )

  const getOptions = useCallback((): AttributeOption[] => {
    const list = attributes
      .filter(attribute => {
        if (attribute.type === 'attribute_type') {
          return true
        }

        const definition = attributeDefsById[attribute.attribute_def]

        return definition.editable || definition.show
      })
      .map(attribute => {
        if (attribute.type === 'attribute_type') {
          return {
            type: attribute.type,
            attribute,
            disabled: false,
            label: attribute.label,
            index: 0
          }
        }

        const definition = attributeDefsById[attribute.attribute_def]

        return {
          index: attribute.index,
          disabled: isAttributeDisabled(attribute),
          type: attribute.type,
          attribute,
          label:
            (attribute.index || 0) > 0
              ? `${definition.label} ${attribute.index}`
              : definition.label
        }
      })

    return list
  }, [attributes, attributeDefsById, isAttributeDisabled])

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
