import Fetch from '../../../services/fetch'

/*
  we have a user role cocept in API which
  basically we called this "team" in the web
  and this return active user role (aka active team)
*/
const DEFAULT_ASSOCIATIONS = [
  'brand.roles',
  'brand_role.users',
  'brand.settings'
]

export async function getActiveTeam(): Promise<IUserTeam> {
  try {
    const response = await new Fetch().get('/users/self/active-role').query({
      associations: DEFAULT_ASSOCIATIONS
    })

    return response.body.data
  } catch (e) {
    throw e
  }
}
