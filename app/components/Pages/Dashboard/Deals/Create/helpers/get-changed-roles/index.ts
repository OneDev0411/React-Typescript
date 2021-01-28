export function getChangedRoles(
  roles: IDealRole[],
  role: IDealRole,
  type: 'create' | 'update' | 'delete'
) {
  if (type === 'create') {
    return roles.concat(role)
  }

  if (type === 'delete') {
    return roles.filter(item => item.id !== role.id)
  }

  return roles.map(item => {
    return item.id === role.id ? role : item
  })
}
