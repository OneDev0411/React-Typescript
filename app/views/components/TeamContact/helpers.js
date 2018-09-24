import { getBrand } from '../../../models/brand/get-brand'
import { getActiveTeamId } from '../../../utils/user-teams'

export const getUserTitle = user =>
  [user.first_name, user.last_name].filter(i => i != null).join(' ')

export const getUserInfo = user =>
  [user.email, user.phone_numner].filter(i => i != null).join(', ')

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
        members = [...members, ...role.members]
      })

      return members
    }

    return null
  } catch (error) {
    console.log(error)
    throw error
  }
}
