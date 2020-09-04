import { getField } from '../get-field'

export function getEnderType(deal: IDeal): string {
  const enderType = getField(deal, 'ender_type')
  const dealType = deal.deal_type === 'Buying' ? 'Buying' : 'Listing'

  if (enderType === 'AgentDoubleEnder') {
    return `${dealType} (Agent Double Ender)`
  }

  if (enderType === 'OfficeDoubleEnder') {
    return `${dealType} (Office Double Ender)`
  }

  return dealType
}
