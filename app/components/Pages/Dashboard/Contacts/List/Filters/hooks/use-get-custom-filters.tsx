import { useMemo, ReactNode } from 'react'

import { IAttributeDefsState } from '@app/reducers/contacts/attributeDefs'

type FilterRow = {
  id: string
  label: string
  renderer: () => ReactNode
  tooltip: string
}

export function useGetCustomFilters(
  attributeDef: IAttributeDefsState
): FilterRow[] {
  const customFilters = useMemo(() => {
    return Object.values(attributeDef.byId).reduce(
      (filters: FilterRow[], attribute: IContactAttributeDef) => {
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
