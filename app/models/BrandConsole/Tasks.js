import Fetch from '../../services/fetch/index'

const Tasks = {}

Tasks.addTask = async function (brand_id, checklist_id, task) {
  try {
    return await new Fetch()
      .post(`/brands/${brand_id}/checklists/${checklist_id}/tasks`)
      .send(task)
  } catch (e) {
    return null
  }
}

Tasks.editTask = async function (checklist, task) {
  try {
    return await new Fetch()
      .put(`/brands/${checklist.brand}/checklists/${checklist.id}/tasks/${task.id}`)
      .send(task)
  } catch (e) {
    return null
  }
}

Tasks.deleteTask = async function (checklist, taskId) {
  try {
    return await new Fetch().delete(`/brands/${checklist.brand}/checklists/${checklist.id}/tasks/${taskId}`)
  } catch (e) {
    return null
  }
}

export default Tasks
