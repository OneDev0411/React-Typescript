import { get as getAttribute } from 'underscore.get'

import { getLegalFullName } from '../../../utils/roles'

export function normalizeRoleNames(deal, roleNames) {
  return roleNames.split(',').map(name => {
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

function getAttributeValue(role, context, defaultValue) {
  const attributes = context.attributes || [context.attribute]

  let value = ''

  attributes.some(attribute => {
    if (attribute === 'legal_full_name') {
      value = getLegalFullName(role)
    } else {
      value = getAttribute(role, attribute, defaultValue)
    }

    // this will detect null, empty strings, false, undefined, but zero
    return !(!value && value !== 0)
  })

  return value
}

export function getRolesText(roles, deal, roleNames, annotationContext) {
  if (!Array.isArray(deal.roles)) {
    return ''
  }

  return deal.roles
    .map(id => roles[id])
    .filter(role => normalizeRoleNames(deal, roleNames).includes(role.role))
    .map(role => getAttributeValue(role, annotationContext, ''))
    .join(', ')
}

export function getRoleText(roles, deal, roleNames, annotationContext) {
  if (!Array.isArray(deal.roles)) {
    return ''
  }

  const { number } = annotationContext

  const list = deal.roles
    .map(id => roles[id])
    .filter(role => normalizeRoleNames(deal, roleNames).includes(role.role))

  return list.length > 0
    ? getAttributeValue(list[number], annotationContext)
    : ''
}
