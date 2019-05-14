import { get as getAttribute } from 'underscore.get'

import { getLegalFullName } from 'deals/utils/roles'

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

export function getRoleText(roles, deal, roleNames, annotation) {
  const list = roles.filter(role =>
    normalizeRoleNames(deal, roleNames).includes(role.role)
  )

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
