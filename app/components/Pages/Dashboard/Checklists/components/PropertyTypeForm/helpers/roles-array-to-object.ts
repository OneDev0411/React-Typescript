export function rolesArrayToObject(
  requiredRoles: string[] = [],
  optionalRoles: string[] = []
) {
  return {
    ...requiredRoles.reduce(
      (acc, name) => ({
        ...acc,
        [name]: true
      }),
      {}
    ),
    ...optionalRoles.reduce(
      (acc, name) => ({
        ...acc,
        [name]: false
      }),
      {}
    )
  }
}
