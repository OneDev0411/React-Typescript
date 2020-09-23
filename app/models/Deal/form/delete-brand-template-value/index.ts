import Fetch from '../../../../services/fetch'

export async function deleteBrandFormTemplateValues(
  brandId: UUID,
  formId: UUID,
  field: string
) {
  try {
    return new Fetch().delete(
      `/brands/${brandId}/forms/templates/${formId}/${field}`
    )
  } catch (e) {
    throw e
  }
}
