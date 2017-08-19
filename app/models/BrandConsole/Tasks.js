import Fetch from '../../services/fetch/index'

const Tasks = {}

Tasks.addTasks = async function (role, tasks) {
  try {
    return await new Fetch()
      .post(`/brands/checklists/${role.id}/tasks`)
      .send(tasks)
  } catch (e) {
    return null
  }
}

Tasks.deleteTask = async function (role, task_id) {
  try {
    return await new Fetch().delete(`/brands/${role.brand}/roles/${role.id}/tasks/${task_id}`)
  } catch (e) {
    console.log(e)
    return null
  }
}

export default Tasks
