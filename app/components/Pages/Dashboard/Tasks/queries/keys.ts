import { TasksListFilters } from '../context'

const TYPE = ['crm_tasks']

export function all() {
  return [TYPE]
}

export function allLists() {
  return [...all(), 'list']
}

export function list(sortyBy: string, filter: Partial<TasksListFilters>) {
  return [
    ...allLists(),
    {
      sortyBy,
      ...filter
    }
  ]
}

export function taskMembers() {
  return [...all(), 'task_members']
}
