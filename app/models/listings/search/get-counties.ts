import Fetch from '../../../services/fetch'

export async function getCounties(
  query: string
): Promise<{ options: ICounty[] }> {
  if (!query || query.length < 4) {
    return Promise.resolve({ options: [] as ICounty[] })
  }

  try {
    const response = await new Fetch().get(`/counties/search?q=${query}`)

    const options = response.body.data.map(({ title }) => ({
      label: title,
      value: title
    }))

    return { options }
  } catch (error) {
    return Promise.resolve({ options: [] as ICounty[] })
  }
}

export default getCounties
