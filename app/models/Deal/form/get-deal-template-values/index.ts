import Fetch from '../../../../services/fetch'

export async function getDealFormTemplateValues(
  dealId: UUID,
  formId: UUID
): Promise<IFormTemplateValue[]> {
  try {
    const response = await new Fetch().get(
      `/deals/${dealId}/forms/templates/${formId}`
    )

    return response.body.data
  } catch (e) {
    throw e
  }
}
