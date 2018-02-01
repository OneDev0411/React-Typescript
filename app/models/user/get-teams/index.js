import Fetch from '../../../services/fetch'

const getTeams = async ({ access_token }) => {
  try {
    const fetchTeams = new Fetch().get('/users/self/roles')

    if (access_token) {
      fetchTeams.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchTeams

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getTeams
