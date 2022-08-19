import { useMemo } from 'react'

import { IAttributeDefsState } from '@app/reducers/contacts/attributeDefs'
import { DateFilterType } from '@app/views/components/Grid/Filters/FilterTypes/Date'

export function useGetCustomFilters(
  attributeDef: IAttributeDefsState
): IFilterConfig[] {
  const customFilters = useMemo(() => {
    return Object.values(attributeDef.byId).reduce(
      (filters: IFilterConfig[], attribute: IContactAttributeDef) => {
        if (attribute.data_type === 'date') {
          filters.push({
            id: attribute.id,
            label: attribute.label,
            renderer: props => <DateFilterType {...props} />,
            tooltip: attribute.section
          })
        }

        return filters
      },
      []
    )
  }, [attributeDef])

  return customFilters
}
