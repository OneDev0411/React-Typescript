import Fetch from '../../../services/fetch'

export async function getSubdivisions(
  query: string
): Promise<{ options: ISubdivision[] }> {
  if (!query || query.length < 4) {
    return Promise.resolve({ options: [] as ISubdivision[] })
  }

  try {
    const response = await new Fetch().get(`/subdivisions/search?q=${query}`)

    const options = response.body.data.map(({ title, appearances }) => ({
      label: title,
      value: appearances
    }))

    return { options }
  } catch (error) {
    return Promise.resolve({ options: [] as ISubdivision[] })
  }
}

export default getSubdivisions
