import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'
import useNotify from '@app/hooks/use-notify'
import { CRM_TASKS_QUERY } from '@app/models/contacts/helpers'
import { updateTask } from '@app/models/tasks/update-task'

import type { ITask } from '../types'

import { list } from './keys'

interface TasksQuery {
  pageParams?: string[] | undefined
  pages: {
    data: ITask[]
  }[]
}

export function useTaskMutation(task: ITask) {
  const queryClient = useQueryClient()
  const notify = useNotify()

  const getNextPages = (
    previousTasks: TasksQuery | undefined,
    data: Partial<ITask>
  ) => {
    return previousTasks?.pages.map(page => ({
      ...page,
      data: page.data.map((item: ITask) =>
        item.id === task.id
          ? {
              ...item,
              ...data
            }
          : item
      )
    }))
  }

  return useMutation(
    async (data: Partial<ITask>) =>
      updateTask(
        {
          id: task.id,
          title: task.title,
          due_date: task.due_date,
          task_type: task.task_type,
          status: task.status,
          ...data
        },
        CRM_TASKS_QUERY
      ),
    {
      onMutate: async data => {
        await queryClient.cancelQueries(list())

        const previousTasks = queryClient.getQueryData<TasksQuery>(list())

        if (previousTasks) {
          queryClient.setQueryData<TasksQuery>(list(), {
            ...previousTasks,
            pages: getNextPages(previousTasks, data) ?? []
          })
        }

        return {
          previousTasks
        }
      },
      onSuccess: (data: ITask, _, { previousTasks }) => {
        queryClient.setQueryData<TasksQuery>(list(), {
          ...previousTasks,
          pages: getNextPages(previousTasks, data) ?? []
        })
      },
      onError: (_, __, context) => {
        if (context?.previousTasks) {
          queryClient.setQueryData<TasksQuery>(list(), context.previousTasks)
        }

        notify({
          message: 'We were unable to store data. It can be attempted again.',
          status: 'error'
        })
      }
    }
  )
}
