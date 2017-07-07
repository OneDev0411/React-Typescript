import Fetch from '../../../services/fetch'

const getMlsSubareas = async areas => {
  const query = areas.map(({ value }) => `parents[]=${value}`).join('&')

  if (!query) {
    return Promise.resolve()
  }

  try {
    const response = await new Fetch()
      .get(`/areas/search?${query}`)

    return response.body.data.map(({ title, number }) => ({
      value: number,
      label: `${title}: #${number}`
    }))
  } catch (error) {
    // console.log(error.message)
  }
}

export default getMlsSubareas