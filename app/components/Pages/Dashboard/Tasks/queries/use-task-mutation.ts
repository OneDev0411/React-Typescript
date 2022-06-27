import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'
import useNotify from '@app/hooks/use-notify'
import { CRM_TASKS_QUERY } from '@app/models/contacts/helpers'
import { updateTask } from '@app/models/tasks/update-task'

import { useTasksListContext } from '../List/context/use-tasks-list-context'
import type { ITask } from '../types'

import { allLists, list } from './keys'

interface TasksQuery {
  pageParams?: string[] | undefined
  pages: {
    data: ITask[]
  }[]
}

export function useTaskMutation(task: ITask) {
  const queryClient = useQueryClient()
  const { sortBy } = useTasksListContext()

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

  const normalize = (data: Partial<ITask>) => ({
    ...data,
    associations: data.associations?.map(association => ({
      association_type: association.association_type,
      id: association.id,
      [association.association_type]:
        association[association.association_type].id
    })),
    assignees: data.assignees?.map(assignee => assignee.id)
  })

  return useMutation(
    async (data: Partial<ITask>) =>
      updateTask(
        {
          id: task.id,
          title: task.title,
          due_date: task.due_date,
          task_type: task.task_type,
          status: task.status,
          ...normalize(data)
        },
        CRM_TASKS_QUERY
      ),
    {
      onMutate: async (data: Partial<ITask>) => {
        await queryClient.cancelQueries(list(sortBy))

        const previousTasks = queryClient.getQueryData<TasksQuery>(list(sortBy))

        if (previousTasks) {
          queryClient.setQueryData<TasksQuery>(list(sortBy), {
            ...previousTasks,
            pages: getNextPages(previousTasks, data) ?? []
          })
        }

        return {
          previousTasks
        }
      },
      onSuccess: (
        data: ITask,
        _: Partial<ITask>,
        {
          previousTasks
        }: {
          previousTasks: TasksQuery
        }
      ) => {
        queryClient.setQueryData<TasksQuery>(list(sortBy), {
          ...previousTasks,
          pages: getNextPages(previousTasks, data) ?? []
        })
      },
      onError: (
        _: unknown,
        __: Partial<ITask>,
        context: { previousTasks: TasksQuery }
      ) => {
        if (context?.previousTasks) {
          queryClient.setQueryData<TasksQuery>(
            list(sortBy),
            context.previousTasks
          )
        }

        notify({
          message: 'We were unable to store data. It can be attempted again.',
          status: 'error'
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries(allLists())
      }
    }
  )
}
