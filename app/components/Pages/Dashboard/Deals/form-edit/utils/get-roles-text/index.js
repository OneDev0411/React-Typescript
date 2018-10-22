import { get as getAttribute } from 'underscore.get'
import { getLegalFullName } from '../../../utils/roles'

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

function getAttributeValue(role, attribute, defaultValue) {
  if (attribute === 'legal_full_name') {
    return getLegalFullName(role)
  }

  return getAttribute(role, attribute, defaultValue)
}

export function getRolesText(roles, deal, roleName, annotationContext) {
  if (!Array.isArray(deal.roles)) {
    return ''
  }

  const { attribute } = annotationContext

  return deal.roles
    .map(id => roles[id])
    .filter(role => normalizeRoleName(deal, roleName).includes(role.role))
    .map(role => getAttributeValue(role, attribute, ''))
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

  return list.length > 0 ? getAttributeValue(list[number], attribute) : ''
}
