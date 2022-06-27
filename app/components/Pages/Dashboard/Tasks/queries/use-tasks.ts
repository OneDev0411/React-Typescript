import { useMemo } from 'react'

import { useInfiniteQuery } from '@app/hooks/query'
import { getTasks } from 'models/tasks/get-tasks'

import { list } from './keys'

const LIMIT = 100

export function useTasks(sortyBy: string) {
  const { data, ...params } = useInfiniteQuery(
    list(sortyBy),
    ({ pageParam = 0 }) =>
      getTasks({
        order: sortyBy,
        limit: LIMIT,
        start: pageParam,
        associations: [
          'crm_task.associations',
          'crm_task.assignees',
          'crm_association.listing',
          'crm_association.contact',
          'crm_association.deal'
        ],
        omit: ['crm_task.metadata']
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        const { total } = lastPage.info
        const nextOffset = pages.length * LIMIT

        return nextOffset < total ? nextOffset : undefined
      }
    }
  )

  const tasks = useMemo(
    () =>
      data?.pages.flatMap(page => page.data) as ICRMTask<
        'assignees' | 'associations'
      >[],
    [data?.pages]
  )

  return {
    ...params,
    tasks
  }
}
