import { getItems } from 'models/Deal/helpers/dynamic-context'

export function getDealContexts(
  deal: IDeal,
  dealType?: IDealType,
  dealPropertyType?: IDealPropertyType,
  hasActiveOffer = false
): IDealBrandContext[] {
  if (!dealType || !dealPropertyType) {
    return []
  }

  return getItems(deal.id, dealType, dealPropertyType, hasActiveOffer).filter(
    (field: IDealBrandContext) => {
      if (!field.mandatory) {
        return false
      }

      if (['contract_status', 'listing_status'].includes(field.key)) {
        return false
      }

      return true
    }
  )
}
