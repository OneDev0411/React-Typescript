import { getBrandFormTemplateValues } from 'models/Deal/form'

export async function getDefaultValues(
  deal: IDeal,
  formId: UUID
): Promise<Record<string, string>> {
  const list = await getBrandFormTemplateValues(deal.brand.id, formId)

  return list.reduce((acc, item) => {
    return {
      ...acc,
      [item.field]: item.value
    }
  }, {})
}
