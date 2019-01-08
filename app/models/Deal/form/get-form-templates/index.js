import Fetch from '../../../../services/fetch'

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
