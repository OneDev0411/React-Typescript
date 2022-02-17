import { getField } from '../get-field'

export function getEnderType(deal: IDeal): string {
  const enderType = getField(deal, 'ender_type')
  const isLeasing = deal.property_type.is_lease

  const saleTypes = {
    Buying: 'Buyer',
    Selling: 'Seller'
  }

  const leaseTypes = {
    Buying: 'Tenant',
    Selling: 'Landlord'
  }

  const dealType = isLeasing
    ? leaseTypes[deal.deal_type]
    : saleTypes[deal.deal_type]

  if (enderType === 'AgentDoubleEnder') {
    return `${dealType} (Agent Double Ender)`
  }

  if (enderType === 'OfficeDoubleEnder') {
    return `${dealType} (Office Double Ender)`
  }

  return dealType
}
