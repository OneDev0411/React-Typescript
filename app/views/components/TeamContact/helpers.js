import { getBrand } from '../../../models/brand/get-brand'
import { getActiveTeamId } from '../../../utils/user-teams'

export async function getMembers(user) {
  if (!user) {
    throw new Error(`User is ${user}`)
  }

  try {
    const brandId = getActiveTeamId(user)
    const brand = await getBrand(
      brandId,
      'associations[]=brand.roles&associations[]=brand_role.members'
    )

    if (brand && Array.isArray(brand.roles) && brand.roles.length > 0) {
      let members = []

      brand.roles.forEach(role => {
        if (role.members) {
          members = [...members, ...role.members]
        }
      })

      return members
    }

    return null
  } catch (error) {
    console.log(error)
    throw error
  }
}
