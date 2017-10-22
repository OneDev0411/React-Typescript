import Fetch from '../../../services/fetch'

const getCounties = async query => {
  if (!query || query.length < 4) {
    return Promise.resolve(() => ({ options: [] }))
  }

  try {
    const response = await new Fetch().get(`/counties/search?q=${query}`)

    const options = response.body.data.map(({ title }) => ({
      label: title,
      value: title
    }))
    return { options }
  } catch (error) {
    // console.log(error.message)
  }
}

export default getCounties
