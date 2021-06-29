import { useCallback, useEffect } from 'react'

import { useAcl } from '@app/views/components/Acl/use-acl'
import { ACL } from '@app/constants/acl'

import { getTasks } from 'models/tasks/get-tasks'
import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'
import useAsync from '@app/hooks/use-async'

import { OpenHouseRow } from './types'

interface UseListingLoadOpenHouseRowsReturn {
  isLoading: boolean
  rows: OpenHouseRow[]
  reload: () => Promise<OpenHouseRow[]>
  hasAccess: boolean
}

const openHouseAccess = [ACL.CRM, ACL.MARKETING]
const defaultFilter = { task_type: 'Open House' }

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
              associations: CRM_TASKS_QUERY.associations,
              ...defaultFilter
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
