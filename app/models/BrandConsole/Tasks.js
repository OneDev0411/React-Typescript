import Fetch from '../../services/fetch/index'

const Tasks = {}

Tasks.addTask = async function (checklist_id, task) {
  try {
    return await new Fetch()
      .post(`/brands/checklists/${checklist_id}/tasks`)
      .send(task)
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
