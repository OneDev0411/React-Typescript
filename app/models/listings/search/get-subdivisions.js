import Fetch from '../../../services/fetch'

const getSubdivisions = async query => {
  if (!query || query.length < 4) {
    return Promise.resolve(() => ({ options: [] }))
  }

  try {
    const response = await new Fetch().get(`/subdivisions/search?q=${query}`)

    const options = response.body.data.map(({ title, appearances }) => ({
      label: title,
      value: appearances
    }))
    return { options }
  } catch (error) {
    // console.log(error.message)
  }
}

export default getSubdivisions
