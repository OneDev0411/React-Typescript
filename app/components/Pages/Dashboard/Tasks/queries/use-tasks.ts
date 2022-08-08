import { useMemo } from 'react'

import { useInfiniteQuery } from '@app/hooks/query'
import { getTasks } from 'models/tasks/get-tasks'

import { useTasksListContext } from '../context/use-tasks-list-context'

import { list } from './keys'

const LIMIT = 100

export function useTasks() {
  const { sortBy, filter } = useTasksListContext()

  const { data, ...params } = useInfiniteQuery(
    list(sortBy, filter),
    ({ pageParam = 0 }) =>
      getTasks({
        q: filter.q,
        task_type: filter.type,
        status: filter.status,
        due_gte: filter.dueDate?.from
          ? filter.dueDate.from.getTime() / 1000
          : undefined,
        due_lte: filter.dueDate?.to
          ? filter.dueDate?.to.getTime() / 1000
          : undefined,
        'assignees[]': filter.assignees?.map(user => user.id),
        order: sortBy,
        limit: LIMIT,
        start: pageParam,
        'associations[]': [
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
