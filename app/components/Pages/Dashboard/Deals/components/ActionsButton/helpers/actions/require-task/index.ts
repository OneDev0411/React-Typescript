import { setTaskRequirement } from 'actions/deals/task/set-task-requirement'

import store from 'store'

interface Arguments {
  task: IDealTask
}

export async function requireTask({ task }: Arguments) {
  //  TODO(redux): check if thunk action types are detected when redux is upgraded
  store.dispatch(setTaskRequirement(task.id, !task.required) as any)
}
