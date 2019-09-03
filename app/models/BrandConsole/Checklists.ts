import Fetch from '../../services/fetch/index'

export async function getBrandChecklists(brand: string): Promise<any[]> {
  const response = await new Fetch().get(`/brands/${brand}/checklists`)

  return response.body.data
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
