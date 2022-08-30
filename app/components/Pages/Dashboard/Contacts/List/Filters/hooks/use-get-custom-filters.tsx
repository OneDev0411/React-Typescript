import { ReactNode, useCallback, useMemo } from 'react'

import {
  IAttributeDefsState,
  selectDefinitionByName
} from '@app/reducers/contacts/attributeDefs'
import { DateFilterType } from '@app/views/components/Grid/Filters/FilterTypes/Date'
import { OperatorAndOperandFilter } from '@app/views/components/Grid/Filters/FilterTypes/OparatorAndOperand'

export function useGetCustomFilters(
  attributeDefs: IAttributeDefsState
): IFilterConfig[] {
  const invalidCustomFilter = useMemo(() => {
    const tagDefinitionId = selectDefinitionByName(attributeDefs, 'tag')?.id
    const sourceDefinitionId = selectDefinitionByName(
      attributeDefs,
      'source_type'
    )?.id

    return [tagDefinitionId, sourceDefinitionId]
  }, [attributeDefs])

  const validateAttribute = useCallback(
    (attribute: IContactAttributeDef) => {
      if (!attribute.filterable || invalidCustomFilter.includes(attribute.id)) {
        return false
      }

      const isDate = attribute.data_type === 'date'
      const isEnum =
        attribute.data_type === 'text' && Array.isArray(attribute.enum_values)

      if (isDate || isEnum) {
        return true
      }

      return false
    },
    [invalidCustomFilter]
  )

  const getAttributeComponent = (
    attribute: IContactAttributeDef,
    props: IFilterConfigRenderer
  ): ReactNode => {
    const isDate = attribute.data_type === 'date'
    const isEnum =
      attribute.data_type === 'text' && Array.isArray(attribute.enum_values)

    if (isEnum) {
      const values = attribute.enum_values!.map(value => ({
        label: value,
        value
      }))

      return <OperatorAndOperandFilter {...props} options={values} />
    }

    if (isDate) {
      return <DateFilterType {...props} />
    }

    return 'Not Found'
  }

  const customFilters = useMemo(() => {
    return Object.values(attributeDefs.byId).reduce(
      (filters: IFilterConfig[], attribute: IContactAttributeDef) => {
        if (validateAttribute(attribute)) {
          filters.push({
            id: attribute.id,
            label: attribute.label,
            renderer: props => getAttributeComponent(attribute, props),
            tooltip: attribute.section
          })
        }

        return filters
      },
      []
    )
  }, [attributeDefs.byId, validateAttribute])

  return customFilters
}
