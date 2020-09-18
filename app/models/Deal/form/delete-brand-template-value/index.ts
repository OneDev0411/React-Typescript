import Fetch from '../../../../services/fetch'

export async function deleteBrandFormTemplateValues(
  brandId: UUID,
  formId: UUID,
  field: string
) {
  try {
    const response = await new Fetch().delete(
      `/brands/${brandId}/forms/templates/${formId}/${field}`
    )

    return response.body.data
  } catch (e) {
    throw e
  }
}
