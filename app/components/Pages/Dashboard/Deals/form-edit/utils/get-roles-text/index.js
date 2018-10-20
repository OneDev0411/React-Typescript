import { get as getAttribute } from 'underscore.get'

function normalizeRoleName(deal, roleName) {
  return roleName.split(',').map(name => {
    if (name !== 'PrimaryAgent') {
      return name
    }

    if (deal.deal_type === 'Buying') {
      return 'BuyerAgent'
    }

    if (deal.deal_type === 'Selling') {
      return 'SellerAgent'
    }

    return name
  })
}

export function getRolesText(roles, deal, roleName, annotationContext) {
  if (!Array.isArray(deal.roles)) {
    return ''
  }

  const { attribute } = annotationContext

  return deal.roles
    .map(id => roles[id])
    .filter(role => normalizeRoleName(deal, roleName).includes(role.role))
    .map(role => getAttribute(role, attribute, ''))
    .join(', ')
}

export function getRoleText(roles, deal, roleName, annotationContext) {
  if (!Array.isArray(deal.roles)) {
    return ''
  }

  const { attribute, number } = annotationContext

  const list = deal.roles
    .map(id => roles[id])
    .filter(role => normalizeRoleName(deal, roleName).includes(role.role))

  return list.length > 0 ? getAttribute(list[number], attribute) : ''
}
