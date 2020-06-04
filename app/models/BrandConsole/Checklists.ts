import Fetch from '../../services/fetch'

export async function getBrandChecklists(
  brandId: string
): Promise<IBrandChecklist[]> {
  const response = await new Fetch().get(`/brands/${brandId}/checklists`)

  return response.body.data
}

export async function addBrandCheckListTask(
  brandId: string,
  checklistId: string,
  taskData: IBrandChecklistTaskInput
): Promise<IBrandChecklist> {
  const response = await new Fetch()
    .post(`/brands/${brandId}/checklists/${checklistId}/tasks`)
    .send(taskData)

  return response.body.data
}

export async function removeBrandChecklistTask(
  brandId: string,
  checklistId: string,
  taskId: string
): Promise<void> {
  await new Fetch().delete(
    `/brands/${brandId}/checklists/${checklistId}/tasks/${taskId}`
  )
}

export async function updateBrandChecklistTask(
  brandId: string,
  task: IBrandChecklistTask
): Promise<IBrandChecklist> {
  const response = await new Fetch()
    .put(`/brands/${brandId}/checklists/${task.checklist}/tasks/${task.id}`)
    .send(task)

  return response.body.data
}

export async function updateBrandChecklist(
  checklist: IBrandChecklist
): Promise<IBrandChecklist> {
  const response = await new Fetch()
    .put(`/brands/${checklist.brand}/checklists/${checklist.id}`)
    .send(checklist)

  return response.body.data
}

export async function addBrandChecklist(brand, checklist) {
  try {
    return await new Fetch().post(`/brands/${brand}/checklists`).send(checklist)
  } catch (error) {
    return { error }
  }
}

export async function deleteChecklist(checklist) {
  try {
    return await new Fetch().delete(
      `/brands/${checklist.brand}/checklists/${checklist.id}`
    )
  } catch (error) {
    return { error }
  }
}

export async function sortTasks(
  brand: UUID,
  checklist: UUID,
  list: { id: UUID; order: number }[]
) {
  try {
    return await new Fetch()
      .put(`/brands/${brand}/checklists/${checklist}/sort`)
      .send(list)
  } catch (error) {
    return { error }
  }
}
