export function rolesArrayToObject(
  requiredRoles: IDealRoleDefinition[] = [],
  optionalRoles: IDealRoleDefinition[] = []
) {
  return {
    ...requiredRoles
      .filter(definition => !!definition)
      .reduce(
        (acc, { role }) => ({
          ...acc,
          [role]: true
        }),
        {}
      ),
    ...optionalRoles
      .filter(definition => !!definition)
      .reduce(
        (acc, { role }) => ({
          ...acc,
          [role]: false
        }),
        {}
      )
  }
}
