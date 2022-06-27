import { useContext } from 'react'

import { TasksListContext, Context } from '.'

export function useTasksListContext() {
  return useContext(TasksListContext) as Context
}
