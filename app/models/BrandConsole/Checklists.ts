import Fetch from '../../services/fetch/index'

export async function getBrandChecklists(
  brandId: string
): Promise<IBrandChecklist[]> {
  const response = await new Fetch().get(`/brands/${brandId}/checklists`)

  return response.body.data
}

export async function addBrandCheckListTask(
  brandId: string,
  checklistId: string,
  taskData: IDealTaskInput
): Promise<IBrandChecklist> {
  const response = await new Fetch()
    .post(`/brands/${brandId}/checklists/${checklistId}/tasks`)
    .send(taskData)

  return response.body.data
}

export async function removeBrandCheckListTask(
  brandId: string,
  checklistId: string,
  taskId: string
): Promise<void> {
  await new Fetch().delete(
    `/brands/${brandId}/checklists/${checklistId}/tasks/${taskId}`
  )
}

export async function addBrandChecklist(brand, checklist) {
  try {
    return await new Fetch().post(`/brands/${brand}/checklists`).send(checklist)
  } catch (error) {
    return { error }
  }
}

export async function editBrandChecklist(checklist) {
  try {
    return await new Fetch()
      .put(`/brands/${checklist.brand}/checklists/${checklist.id}`)
      .send(checklist)
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
