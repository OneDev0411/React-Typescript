import { getBrandById } from '@app/models/brand/get-brand-by-id'
import { getBrandUsers } from 'utils/user-teams'

export async function getMembers(brandId) {
  if (!brandId) {
    throw new Error('brand id is not available')
  }

  try {
    const brand = await getBrandById(brandId)

    if (brand == null) {
      return null
    }

    return getBrandUsers(brand)
  } catch (error) {
    console.log(error)
    throw error
  }
}
