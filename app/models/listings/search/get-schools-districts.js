import Fetch from '../../../services/fetch'

const getSchoolsDistricts = async query => {
  if (!query || query.length < 4) {
    return Promise.resolve(() => ({ options: [] }))
  }

  try {
    const response = await new Fetch().get(
      `/schools/districts/search?q[]=${query}`
    )

    const options = response.body.data.map(({ district }) => ({
      label: district,
      value: district
    }))
    return { options }
  } catch (error) {
    // console.log(error.message)
  }
}

export default getSchoolsDistricts
