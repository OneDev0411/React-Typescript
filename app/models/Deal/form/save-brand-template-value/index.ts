import Fetch from '../../../../services/fetch'

export async function saveBrandFormTemplateValues(
  brandId: UUID,
  formId: UUID,
  field: string,
  value: string | boolean
) {
  try {
    const response = await new Fetch()
      .post(`/brands/${brandId}/forms/templates/${formId}/${field}`)
      .send({
        value
      })

    return response.body.data
  } catch (e) {
    throw e
  }
}
