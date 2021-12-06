export function rolesArrayToObject(
  requiredRoles: IDealRoleDefinition[] = [],
  optionalRoles: IDealRoleDefinition[] = []
) {
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
