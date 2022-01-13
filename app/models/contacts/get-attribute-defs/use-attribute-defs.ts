import { useMemo } from 'react'

import { useQuery } from '@app/hooks/query'

import { list } from '../query-keys/attribute-def'

import { getAttributeDefs } from './index'

export function useAttributeDefs() {
  const result = useQuery(list(), getAttributeDefs, {
    staleTime: Infinity,
    cacheTime: Infinity
  })

  const normalized = useMemo(() => {
    if (!result.data) {
      return {
        byId: {},
        byName: {},
        bySection: {}
      }
    }

    return {
      byId: groupById(result.data),
      byName: groupByName(result.data),
      bySection: groupBySection(result.data)
    }
  }, [result])

  return {
    result,
    normalized
  }
}

/**
 * Normalizes attribute definitions by their ids
 *
 * @param list of attribute definitions
 * @returns a record<id, attributeDef>
 */
function groupById(
  list: IContactAttributeDef[]
): Record<UUID, IContactAttributeDef> {
  return list.reduce((list, item) => {
    return {
      ...list,
      [item.id]: item
    }
  }, {})
}

/**
 * Groups attribute definitions by their names
 *
 * @param list of attribute definitions
 * @returns a record<string, id>
 */
function groupByName(list: IContactAttributeDef[]): Record<string, UUID> {
  return list.reduce((list, item) => {
    if (!item.name) {
      return list
    }

    return {
      ...list,
      [item.name]: item.id
    }
  }, {})
}

/**
 * Normalizes attribute definitions by their sections
 *
 * @param list of attribute definitions
 * @returns a record<string, string[]>
 */
function groupBySection(list: IContactAttributeDef[]): Record<string, UUID[]> {
  return list.reduce((list, item) => {
    return {
      ...list,
      [item.section]: [...(list[item.section] ?? []), item.id]
    }
  }, {})
}
