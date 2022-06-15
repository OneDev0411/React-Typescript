import { useQuery } from '@app/hooks/query'
import { getTasks } from 'models/tasks/get-tasks'

import { list } from './keys'

export function useTasks() {
  const { data: response, ...params } = useQuery(
    list(),
    () =>
      getTasks({
        order: '-created_at',
        limit: 50,
        start: 0,
        associations: [
          'crm_task.associations',
          'crm_task.assignees',
          'crm_association.listing',
          'crm_association.contact',
          'crm_association.deal'
        ],
        omit: ['crm_task.metadata']
      }),
    {}
  )

  return {
    ...params,
    data: response ? response.data : []
  }
}
