import type { ITask } from '../types'

export interface TasksQuery {
  pageParams?: string[] | undefined
  pages: {
    data: ITask[]
  }[]
}
