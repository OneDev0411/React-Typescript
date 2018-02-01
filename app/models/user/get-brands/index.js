import Fetch from '../../../services/fetch'

const getBrands = async ({ access_token }) => {
  try {
    const fetchBrands = new Fetch().get('/users/self/roles')

    if (access_token) {
      fetchBrands.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchBrands

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default getBrands
