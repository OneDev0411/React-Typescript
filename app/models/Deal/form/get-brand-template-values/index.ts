import Fetch from '../../../../services/fetch'

export async function getBrandFormTemplateValues(
  brandId: UUID,
  formId: UUID
): Promise<IFormTemplateValue[]> {
  try {
    const response = await new Fetch().get(
      `/brands/${brandId}/forms/templates/${formId}`
    )

    return response.body.data
  } catch (e) {
    throw e
  }
}
