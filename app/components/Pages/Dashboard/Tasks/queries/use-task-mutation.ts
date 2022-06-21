import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'
import { CRM_TASKS_QUERY } from '@app/models/contacts/helpers'
import { updateTask } from '@app/models/tasks/update-task'

import type { ITask } from '../types'

import { list } from './keys'

export function useTaskMutation(task: ITask) {
  const queryClient = useQueryClient()

  const getNextPages = (previousTasks: any, data: Partial<ITask>) => {
    return previousTasks.pages.map(page => ({
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

  const update = async (data: Partial<ITask>) => {
    return updateTask(
      {
        id: task.id,
        due_date: task.due_date,
        task_type: task.task_type,
        status: task.status,
        ...data
      },
      CRM_TASKS_QUERY
    )
  }

  return useMutation(update, {
    onMutate: async data => {
      await queryClient.cancelQueries(list())

      console.log('mutate', data)

      const previousTasks = queryClient.getQueryData<any>(list())

      if (previousTasks) {
        queryClient.setQueryData<any>(list(), {
          ...previousTasks,
          pages: getNextPages(previousTasks, data)
        })
      }

      return {
        previousTasks
      }
    },
    onSuccess: (data: ITask, variables, { previousTasks }) => {
      console.log('on success', data, variables, previousTasks)

      queryClient.setQueryData<any>(list(), {
        ...previousTasks,
        pages: getNextPages(previousTasks, data)
      })
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<any>('todos', context.previousTasks)
      }
    }
  })
}
