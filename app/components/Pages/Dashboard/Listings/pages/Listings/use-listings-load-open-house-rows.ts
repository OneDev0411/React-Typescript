import { useCallback, useEffect } from 'react'

import { ACL } from '@app/constants/acl'
import useAsync from '@app/hooks/use-async'
import { useAcl } from '@app/views/components/Acl/use-acl'
import { getTasks } from 'models/tasks/get-tasks'

import { OpenHouseRow } from './types'

interface UseListingLoadOpenHouseRowsReturn {
  isLoading: boolean
  rows: OpenHouseRow[]
  reload: () => Promise<OpenHouseRow[]>
  hasAccess: boolean
}

const openHouseAccess = [ACL.CRM, ACL.MARKETING]

function useListingLoadOpenHouseRows(): UseListingLoadOpenHouseRowsReturn {
  const hasAccess = useAcl(openHouseAccess)

  const { run, isLoading, data, reset } = useAsync<OpenHouseRow[]>({
    status: hasAccess ? 'pending' : 'idle',
    data: []
  })

  const load = useCallback(
    () =>
      run(
        async () =>
          (
            await getTasks({
              associations: [
                'crm_task.associations',
                'crm_task.assignees',
                'crm_association.listing',
                'crm_association.contact'
              ],
              omit: ['crm_task.metadata'],
              task_type: 'Open House'
            })
          ).data
      ),
    [run]
  )

  const reload = useCallback(() => {
    reset()

    return load()
  }, [reset, load])

  useEffect(() => {
    if (hasAccess) {
      load()
    }
  }, [load, hasAccess])

  return { isLoading, rows: data, reload, hasAccess }
}

export default useListingLoadOpenHouseRows
