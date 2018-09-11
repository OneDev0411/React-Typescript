export function getRolesText(roles, deal, roleName, annotationContext) {
  if (!Array.isArray(deal.roles))
    return ''

  const { attribute } = annotationContext

  return deal.roles
    .map(id => roles[id])
    .filter(role => role.role === roleName)
    .map(role => role[attribute])
    .join(', ')
}

export function getRoleText(roles, deal, roleName, annotationContext) {
  if (!Array.isArray(deal.roles))
    return ''

  const { attribute, number } = annotationContext

  const list = deal.roles
    .map(id => roles[id])
    .filter(role => role.role === roleName)

  return list.length > 0 ? list[number][attribute] : ''
}
