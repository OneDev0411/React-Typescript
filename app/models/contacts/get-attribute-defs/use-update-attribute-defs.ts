import { useMutation } from '@app/hooks/query'
import { queryClient } from '@app/views/components/ReactQueryProvider'

import { list } from '../query-keys/attribute-def'

import { getAttributeDefs, groupById, groupByName, groupBySection } from '.'
import type { NormalizedAttributeDefs } from '.'

export function useUpdateAttributeDefs() {
  return useMutation(getAttributeDefs, {
    onMutate: async (attribute: IContactAttributeDef) => {
      await queryClient.cancelQueries(list())

      const previousData = queryClient.getQueryData(list())

      queryClient.setQueryData(list(), (current: NormalizedAttributeDefs) => {
        const nextList = [...current.list, attribute]

        return {
          list: nextList,
          byId: groupById(nextList),
          byName: groupByName(nextList),
          bySection: groupBySection(nextList)
        }
      })

      return {
        previousData
      }
    }
  })
}
