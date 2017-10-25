import Fetch from '../../../services/fetch'

const getSchools = async districts => {
  const query = districts.map(({ value }) => `districts[]=${value}`).join('&')

  if (!query || query.length < 4) {
    return Promise.resolve(() => ({}))
  }

  try {
    const response = await new Fetch().get(`/schools/search?${query}`)

    return response.body.data.map(({ name, school_type }) => ({
      name,
      type: school_type
    }))
  } catch (error) {
    // console.log(error.message)
  }
}

export default getSchools
