import { setTaskRequirement } from 'actions/deals/task/set-task-requirement'

// eslint-disable-next-line
import store from 'store'

interface Arguments {
  task: IDealTask
}

export async function changeTaskRequired({ task }: Arguments) {
  store.dispatch(setTaskRequirement(task.id, !task.required))
}
