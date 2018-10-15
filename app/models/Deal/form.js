import agent from 'superagent'
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
 * returns form size in bytes
 */
export async function getFormSize(formId) {
  try {
    const response = await agent.get(`/api/pdf/get-size/${formId}`)

    return response.body.total
  } catch (e) {
    console.log(e)

    return 0
  }
}

/**
 * returns list of all templates is belonged to brand and form
 */
export async function getFormTemplates(brandId, formId) {
  try {
    const response = await new Fetch().get(
      `/brands/${brandId}/templates/${formId}`
    )

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * saves form template
 */
export async function saveFormTemplate(brandId, formId, values) {
  try {
    const response = await new Fetch()
      .post(`/brands/${brandId}/templates/${formId}`)
      .send({ values })

    return response.body.data
  } catch (e) {
    console.log(e)
  }
}

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

/**
 * delete a form
 */
export async function deleteForm(checklist, formId) {
  if (!checklist.brand) {
    throw new Error('This user does not belong to any brand')
  }

  try {
    await new Fetch().delete(
      `/brands/${checklist.brand}/checklists/${checklist.id}/forms/${formId}`
    )
  } catch (e) {
    return null
  }
}

export default {
  getForms,
  getFormTemplates,
  addForm,
  saveFormTemplate,
  deleteForm
}
