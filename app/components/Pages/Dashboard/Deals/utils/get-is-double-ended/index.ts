import { getField } from 'models/Deal/helpers/context/get-field'

export function isDoubleEnded(deal: IDeal): boolean {
  const enderType: string = getField(deal, 'ender_type')

  return ['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(enderType)
}
