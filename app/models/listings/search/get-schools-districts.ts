import Fetch from '../../../services/fetch'

export async function getSchoolsDistricts(
  query: string
): Promise<{ options: ISchoolsDistrict[] }> {
  if (!query || query.length < 4) {
    return Promise.resolve({ options: [] as ISchoolsDistrict[] })
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
    return Promise.resolve({ options: [] as ISchoolsDistrict[] })
  }
}

export default getSchoolsDistricts
