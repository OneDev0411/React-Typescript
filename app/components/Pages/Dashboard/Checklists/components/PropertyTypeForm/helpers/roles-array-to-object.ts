export function rolesArrayToObject(
  requiredRoles: IDealRoleDefinition[] = [],
  optionalRoles: IDealRoleDefinition[] = []
) {
  console.log('!!!!', requiredRoles, optionalRoles)

  return {
    ...requiredRoles.reduce(
      (acc, { role }) => ({
        ...acc,
        [role]: true
      }),
      {}
    ),
    ...optionalRoles.reduce(
      (acc, { role }) => ({
        ...acc,
        [role]: false
      }),
      {}
    )
  }
}
