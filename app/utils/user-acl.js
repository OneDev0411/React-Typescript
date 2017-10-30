export function getUserRoles(user) {
  const { brand } = user
  const role = user.roles.find(group => group.brand === user.brand)

  return role ? role.acl : []
}

export function hasUserAccess(user, action) {
  return getUserRoles(user).includes(action)
}
