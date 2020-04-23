import { useEffect, useState, useCallback } from 'react'
import isEqual from 'lodash/isEqual'
import usePrevious from 'react-use/lib/usePrevious'

import { getTasks } from 'models/tasks/get-tasks'
import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'

interface InitialState {
  isFetching: boolean
}

interface Query {
  order?: string
  task_type?: CRMTaskTypes
  associations?: string[]
}

interface FilterCRMTasks {
  error: string
  isFetching: boolean
  list: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>[]
  reloadList: () => Promise<void>
}

/**
 * Fetch filtered CRM tasks
 */
export function useFilterCRMTasks(
  query: Query,
  initialState: InitialState = {
    isFetching: false
  }
): FilterCRMTasks {
  const [list, setList] = useState<
    ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>[]
  >([])
  const prevQurey = usePrevious(query)
  const [error, setError] = useState<string>('')
  const [isFetching, setIsFetching] = useState<boolean>(initialState.isFetching)

  const fetch = useCallback(
    async function fetch(force = false) {
      if (!force && isEqual(prevQurey, query)) {
        return
      }

      try {
        setIsFetching(true)

        const response = await getTasks({
          associations: CRM_TASKS_QUERY.associations,
          ...query
        })

        setList(response.data)
      } catch (error) {
        console.log(error)
        setError(error.message)
      } finally {
        setIsFetching(false)
      }
    },
    [prevQurey, query]
  )

  useEffect(() => {
    fetch()
  }, [fetch])

  return { list, reloadList: () => fetch(true), isFetching, error }
}
