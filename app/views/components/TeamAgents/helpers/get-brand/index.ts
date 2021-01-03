import { getActiveTeam } from 'utils/user-teams'

export function getBrand(user: IUser, isPrimaryAgent: boolean): UUID | null {
  const team = getActiveTeam(user)

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
