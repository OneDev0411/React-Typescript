import { normalizeRoleNames } from '../normalize-role-names'
import { getAttributeValue } from '../get-attribute-value'

export function getRoleText(
  roles: IDealRole[],
  deal: IDeal,
  roleNames: string[],
  annotation: IFormAnnotation
): string {
  const validRoles: string[] = normalizeRoleNames(deal, roleNames)
  const list: IDealRole[] = roles.filter(role => validRoles.includes(role.role))

  if (annotation.attributes?.includes?.('stamp')) {
    const role = list[0]

    return `${role.agent?.office?.name}\t\t${role.agent?.office?.address}\t\tPhone: ${role.agent?.office?.phone}\n${role.legal_full_name}`
  }

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
