import Fetch from '../../../services/fetch'

const getUserProfile = async access_token => {
  try {
    const request = new Fetch()
      .get('/users/self')
      .query({ 'associations[]': ['user.docusign'] })

    // required on ssr
    if (access_token) {
      request.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await request

    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default getUserProfile
