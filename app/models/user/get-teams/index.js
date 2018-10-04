import Fetch from '../../../services/fetch'

const getTeams = async (user = {}, fetchMembers = false) => {
  const { access_token } = user

  try {
    const fetchTeams = new Fetch().get('/users/self/roles')

    if (access_token) {
      fetchTeams.set({ Authorization: `Bearer ${access_token}` })
    }

    if (fetchMembers) {
      fetchTeams
        .query({ 'associations[]': ['brand.roles'] })
        .query({ 'associations[]': ['brand_role.members'] })
    }

    const response = await fetchTeams

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getTeams
