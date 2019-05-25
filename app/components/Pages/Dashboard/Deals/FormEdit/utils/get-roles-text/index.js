import { get as getAttribute } from 'underscore.get'

import { getLegalFullName } from 'deals/utils/roles'

export function normalizeRoleNames(deal, roleNames) {
  const names = Array.isArray(roleNames) ? roleNames : roleNames.split(',')

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

    return name
  })
}

export function getAttributeValue(role, context, defaultValue) {
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

  return value && value.trim()
}

export function getRoleText(roles, deal, roleNames, annotation) {
  const validRoles = normalizeRoleNames(deal, roleNames)
  const list = roles.filter(role => validRoles.includes(role.role))

  if (annotation.type === 'Roles') {
    return list
      .map(role => getAttributeValue(role, annotation, ''))
      .filter(item => item)
      .join(', ')
  }

  return list.length > 0
    ? getAttributeValue(list[annotation.number], annotation)
    : ''
}
