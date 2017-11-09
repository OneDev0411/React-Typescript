export function getUserRoles(user) {
  const { brand, roles } = user

  if (!roles || !brand) {
    return []
  }

  const role = roles.find(group => group.brand === user.brand)
  return role ? role.acl : []
}

export function hasUserAccess(user, action) {
  return getUserRoles(user).includes(action)
}
