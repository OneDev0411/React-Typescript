import { getBrandById } from '../../../models/brand/get-brand-by-id'
import {
  getActiveTeamId,
  getBrandAvailableMembers
} from '../../../utils/user-teams'

export async function getMembers(user) {
  if (!user) {
    throw new Error(`User is ${user}`)
  }

  try {
    const brand = await getBrandById(getActiveTeamId(user))

    if (brand == null) {
      return null
    }

    return getBrandAvailableMembers(brand)
  } catch (error) {
    console.log(error)
    throw error
  }
}
