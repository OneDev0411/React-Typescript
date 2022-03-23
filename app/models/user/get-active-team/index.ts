import Fetch from '../../../services/fetch'

/*
  we have a user role cocept in API which
  basically we called this "team" in the web
  and this return active user role (aka active team)
*/
const DEFAULT_ASSOCIATIONS = [
  'brand_role.users',
  'brand.settings',
  'brand.roles',
  'agent.office'
]

export async function getActiveTeam(
  user?: IUser
): Promise<Nullable<IUserTeam>> {
  try {
    const fetchActiveTeamInstance = new Fetch()
      .get('/users/self/active-role')
      .query({
        associations: DEFAULT_ASSOCIATIONS
      })

    if (user?.access_token) {
      fetchActiveTeamInstance.set({
        Authorization: `Bearer ${user.access_token}`
      })
    }

    const response = await fetchActiveTeamInstance

    return response.body.data
  } catch (e) {
    throw e
  }
}
