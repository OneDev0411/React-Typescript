import Fetch from '../../../../services/fetch'

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
