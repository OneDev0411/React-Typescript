import { isDoubleEnded } from 'deals/utils/get-is-double-ended'

export const dynamicRoles: string[] = [
  'PrimaryAgent',
  'InternalBuyerAgent',
  'ExternalBuyerAgent',
  'InternalBuyer',
  'InternalSeller'
]

export function normalizeRoleNames(
  deal: IDeal,
  roleNames: string | string[]
): string[] {
  const names: string[] = Array.isArray(roleNames)
    ? roleNames
    : roleNames.split(',')

  return names.map((name): string => {
    if (dynamicRoles.includes(name) === false) {
      return name
    }

    if (name === 'InternalBuyer' && deal.deal_type === 'Buying') {
      return 'Buyer'
    }

    if (name === 'InternalSeller' && deal.deal_type === 'Selling') {
      return 'Seller'
    }

    if (name === 'PrimaryAgent') {
      return resolvePrimaryAgent(deal)
    }

    const doubleEnded: boolean = isDoubleEnded(deal)

    if (name === 'InternalBuyerAgent' && doubleEnded) {
      return 'BuyerAgent'
    }

    if (name === 'ExternalBuyerAgent' && !doubleEnded) {
      return 'BuyerAgent'
    }

    return name
  })
}

function resolvePrimaryAgent(deal: IDeal): string {
  if (deal.deal_type === 'Buying') {
    return 'BuyerAgent'
  }

  return 'SellerAgent'
}
