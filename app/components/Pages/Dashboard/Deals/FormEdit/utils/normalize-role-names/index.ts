import { getField } from 'models/Deal/helpers/context/get-field'

export function normalizeRoleNames(
  deal: IDeal,
  roleNames: string | string[]
): string[] {
  const names: string[] = Array.isArray(roleNames)
    ? roleNames
    : roleNames.split(',')

  return names.map(name => {
    if (name !== 'PrimaryAgent') {
      return name
    }

    if (deal.deal_type === 'Buying') {
      return 'BuyerAgent'
    }

    if (deal.deal_type === 'Selling') {
      return 'SellerAgent'
    }

    const enderType = getField(deal, 'ender_type')

    if (['AgentDoubleEnder', 'OfficeDoubleEnder'].includes(enderType)) {
    }
    //     if (deal.context.ender_type === 'AgentDoubleEnder' || deal.context.ender_type === 'OfficeDoubleEnder')
    // ExternalBuyerAgents = deal.roles.filter(r => r.role === 'BuyerAgent')
    // else
    // InternalBuyerAgents = deal.roles.filter(r => r.role === 'BuyerAgent')

    return name
  })
}
