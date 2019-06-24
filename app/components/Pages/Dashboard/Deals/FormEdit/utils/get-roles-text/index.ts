import { normalizeRoleNames } from '../normalize-role-names'
import { getAttributeValue } from '../get-attribute-value'

export function getRoleText(
  roles: IDealRole[],
  deal: IDeal,
  roleNames: string[],
  annotation: any
): string {
  const validRoles: string[] = normalizeRoleNames(deal, roleNames)
  const list: IDealRole[] = roles.filter(role => validRoles.includes(role.role))

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
