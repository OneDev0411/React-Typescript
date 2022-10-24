import { useEffectOnce } from 'react-use'

import { useQueryParam } from '@app/hooks/use-query-param'

export function useTaskSelect(task: IDealTask) {
  const [queryParamSelectTaskId] = useQueryParam<UUID>('task')

  useEffectOnce(() => {
    if (queryParamSelectTaskId && queryParamSelectTaskId === task.id) {
      const taskElement = document.getElementById(
        `task-${queryParamSelectTaskId}`
      )

      taskElement?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  })

  return queryParamSelectTaskId
}
