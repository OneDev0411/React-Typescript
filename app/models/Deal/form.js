import Fetch from '../../services/fetch'

/**
 * get forms list
 */
export async function getForms() {
  try {
    const response = await new Fetch().get('/forms')

    return response.body.data
  } catch (e) {
    console.log(e)
  }
}

/**
 * add a form
 */
export async function addForm(brandId, checklistId, formId) {
  if (!brandId) {
    throw new Error('This user does not belong to any brand')
  }

  try {
    const response = await new Fetch()
      .post(`/brands/${brandId}/checklists/${checklistId}/forms`)
      .send({ form: formId })

    return response.body.data
  } catch (e) {
    console.log(e)
  }
}

/**
 * delete a form
 */
export async function deleteForm(checklist, formId) {
  if (!checklist.brand) {
    throw new Error('This user does not belong to any brand')
  }

  try {
    await new Fetch().delete(`/brands/${checklist.brand}/checklists/${checklist.id}/forms/${formId}`)
  } catch (e) {
    return null
  }
}

export default {
  getForms,
  addForm,
  deleteForm
}
