import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'
import { deleteTask } from '@app/models/tasks'

import { useTasksListContext } from '../context/use-tasks-list-context'
import { ITask } from '../types'

import { allLists, list } from './keys'
import type { TasksQuery } from './types'

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()
  const { sortBy, filter } = useTasksListContext()

  return useMutation(
    async (task: ITask) => {
      try {
        await deleteTask(task.id)
      } catch (error) {
        throw error
      }
    },
    {
      onMutate: async (task: ITask) => {
        await queryClient.cancelQueries(list(sortBy, filter))

        const previousTasks = queryClient.getQueryData<TasksQuery>(
          list(sortBy, filter)
        )

        if (previousTasks) {
          queryClient.setQueryData<TasksQuery>(list(sortBy, filter), {
            ...previousTasks,
            pages: getNextPages(previousTasks, task.id) ?? []
          })
        }

        return {
          previousTasks
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(allLists())
      }
    }
  )
}

const getNextPages = (previousTasks: TasksQuery | undefined, id: UUID) => {
  return previousTasks?.pages.map(page => ({
    ...page,
    data: page.data.filter((task: ITask) => task.id !== id)
  }))
}
