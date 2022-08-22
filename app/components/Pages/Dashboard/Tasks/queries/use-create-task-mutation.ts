import produce from 'immer'
import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'

import { useTasksListContext } from '../context/use-tasks-list-context'
import { ITask } from '../types'

import { allLists, list } from './keys'
import type { TasksQuery } from './types'

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()
  const { sortBy, filter } = useTasksListContext()

  return useMutation(async () => ({}), {
    onMutate: async (task: ITask) => {
      await queryClient.cancelQueries(list(sortBy, filter))

      const previousTasks = queryClient.getQueryData<TasksQuery>(
        list(sortBy, filter)
      )

      if (previousTasks) {
        const nextTasks = produce(previousTasks, draft => {
          draft.pages[0].data = [task, ...draft.pages[0].data]
        })

        queryClient.setQueryData<TasksQuery>(list(sortBy, filter), nextTasks)
      }

      return {
        previousTasks
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(allLists())
    }
  })
}
