import { useEffect, useState, useCallback } from 'react'

import { getTasks } from 'models/tasks/get-tasks'
import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'

interface InitialState {
  isFetching: boolean
}

interface GetTours {
  error: string
  isFetching: boolean
  list: ICRMTask[]
  reloadList: () => Promise<void>
}

/**
 * Fetch all open houses event
 */
export function useGetTours(
  initialState: InitialState = {
    isFetching: false
  }
): GetTours {
  const [list, setList] = useState<
    ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>[]
  >([])
  const [error, setError] = useState<string>('')
  const [isFetching, setIsFetching] = useState<boolean>(initialState.isFetching)

  const fetch = useCallback(async function fetch() {
    try {
      setIsFetching(true)

      const response = await getTasks({
        order: 'due_date',
        task_type: 'Tour',
        associations: CRM_TASKS_QUERY.associations
      })

      setList(response.data)
    } catch (error) {
      console.log(error)
      setError(error.message)
    } finally {
      setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  function reloadList() {
    return fetch()
  }

  return { list, reloadList, isFetching, error }
}
