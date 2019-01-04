import Fetch from '../../../../services/fetch'

/**
 * adds a form
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
