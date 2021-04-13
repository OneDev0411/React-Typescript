import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'
import { normalizeAddress } from 'models/Deal/helpers/normalize-address'

export function createAddressContext(
  deal: IDeal,
  checklists: IDealChecklist[],
  address: unknown
) {
  return Object.entries(normalizeAddress(address)).reduce<
    {
      definition: UUID
      checklist: UUID
      value: unknown
      approved: boolean
    }[]
  >((acc, [name, value]) => {
    const context = createContextObject(
      deal,
      checklists,
      deal.has_active_offer ? 'Offer' : deal.deal_type,
      name,
      value,
      true
    )

    return context ? [...acc, context] : acc
  }, [])
}
