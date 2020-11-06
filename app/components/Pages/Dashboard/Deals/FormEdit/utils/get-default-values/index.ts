import { getDealFormTemplateValues } from 'models/Deal/form'

export async function getDefaultValues(
  dealId: UUID,
  formId: UUID
): Promise<Record<string, string>> {
  const list = await getDealFormTemplateValues(dealId, formId)

  return list.reduce((acc, item) => {
    return {
      ...acc,
      [item.field]: item.value
    }
  }, {})
}
