import Fetch from '../../services/fetch'

const Tasks = {}

Tasks.addTask = async function addTask(brand_id, checklist_id, task) {
  try {
    return await new Fetch()
      .post(`/brands/${brand_id}/checklists/${checklist_id}/tasks`)
      .send(task)
  } catch (error) {
    return { error }
  }
}

Tasks.editTask = async function editTask(checklist, task) {
  try {
    return await new Fetch()
      .put(
        `/brands/${checklist.brand}/checklists/${checklist.id}/tasks/${task.id}`
      )
      .send(task)
  } catch (error) {
    return { error }
  }
}

Tasks.deleteTask = async function deleteTask(checklist, taskId) {
  try {
    return await new Fetch().delete(
      `/brands/${checklist.brand}/checklists/${checklist.id}/tasks/${taskId}`
    )
  } catch (error) {
    return { error }
  }
}

export default Tasks
