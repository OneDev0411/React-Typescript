import { getField } from '../get-field'
import { getSide } from '../get-side'

export function getEnderType(deal: IDeal): string {
  const enderType = getField(deal, 'ender_type')

  const dealType = getSide(deal)

  if (enderType === 'AgentDoubleEnder') {
    return `${dealType} (Agent Dual Agency)`
  }

  if (enderType === 'OfficeDoubleEnder') {
    return `${dealType} (Office Dual Agency)`
  }

  return dealType
}
