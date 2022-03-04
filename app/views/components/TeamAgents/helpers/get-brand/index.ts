export function getBrand(
  team: Nullable<IUserTeam>,
  isPrimaryAgent: boolean
): Nullable<UUID> {
  if (!team) {
    return null
  }

  if (isPrimaryAgent) {
    return team.brand.id
  }

  let brand = team.brand

  while (brand.parent !== null) {
    brand = brand.parent
  }

  return brand.id
}
