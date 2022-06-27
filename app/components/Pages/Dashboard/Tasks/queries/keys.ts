const TYPE = ['crm_tasks']

export function all() {
  return [TYPE]
}

export function allLists() {
  return [...all(), 'list']
}

export function list(sortyBy: string) {
  return [
    ...allLists(),
    {
      sortyBy
    }
  ]
}

export function taskMembers() {
  return [...all(), 'task_members']
}
