import Fetch from '../../../services/fetch'

/**
 * Switch Active Team
 * @param {UUID} [brand] targer brand id
 * @return {IUserTeam} active team (aka active user's role)
 */
export async function switchActiveTeam(brand: UUID): Promise<void> {
  try {
    await new Fetch()
      .patch('/users/self/active-brand')
      .set('X-RECHAT-BRAND', brand)
      .send()
  } catch (error) {
    throw error
  }
}
