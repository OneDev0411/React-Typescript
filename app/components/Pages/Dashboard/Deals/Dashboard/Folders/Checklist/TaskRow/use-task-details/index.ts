import { browserHistory } from 'react-router'
import { useEffectOnce } from 'react-use'

import { useReplaceQueryParam } from '@app/hooks/use-query-param'

export function useTaskDetails(
  deal: IDeal,
  task: IDealTask,
  openTaskDrawer: () => void
) {
  const [queryParamTaskDetail, , queryParamDeleteTaskDetail] =
    useReplaceQueryParam<UUID>('task-detail')

  useEffectOnce(() => {
    if (queryParamTaskDetail && queryParamTaskDetail === task.id) {
      queryParamDeleteTaskDetail()

      if (task.task_type === 'Form' && task.form) {
        browserHistory.push(`/dashboard/deals/${deal.id}/form-edit/${task.id}`)
      } else {
        openTaskDrawer()
      }
    }
  })
}
