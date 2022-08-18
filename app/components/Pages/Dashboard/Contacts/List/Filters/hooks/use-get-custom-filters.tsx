import { useMemo } from 'react'

import { IAttributeDefsState } from '@app/reducers/contacts/attributeDefs'

export function useGetCustomFilters(
  attributeDef: IAttributeDefsState
): IFilterConfig[] {
  const customFilters = useMemo(() => {
    return Object.values(attributeDef.byId).reduce(
      (filters: IFilterConfig[], attribute: IContactAttributeDef) => {
        if (attribute.searchable) {
          filters.push({
            id: attribute.id,
            label: attribute.label,
            renderer: () => <span>{attribute.label}</span>,
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
