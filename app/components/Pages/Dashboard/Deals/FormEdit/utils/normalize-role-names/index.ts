import { isDoubleEnded } from 'deals/utils/get-is-double-ended'

const specialRoles: string[] = [
  'PrimaryAgent',
  'InternalBuyerAgent',
  'ExternalBuyerAgent'
]

export function normalizeRoleNames(
  deal: IDeal,
  roleNames: string | string[]
): string[] {
  const names: string[] = Array.isArray(roleNames)
    ? roleNames
    : roleNames.split(',')

  return names.map(
    (name): string => {
      if (specialRoles.includes(name) === false) {
        return name
      }

      if (name === 'PrimaryAgent') {
        return resolvePrimaryAgent(deal, name)
      }

      const doubleEnded: boolean = isDoubleEnded(deal)

      if (name === 'InternalBuyerAgent' && doubleEnded) {
        return 'BuyerAgent'
      }

      if (name === 'ExternalBuyerAgent' && !doubleEnded) {
        return 'BuyerAgent'
      }

      return name
    }
  )
}

function resolvePrimaryAgent(deal: IDeal, name: string): string {
  if (deal.deal_type === 'Buying') {
    return 'BuyerAgent'
  }

  return 'SellerAgent'
}
