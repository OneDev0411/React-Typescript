import Fetch from '../../../services/fetch'

export async function getSchools(
  districts: string[] | ISchoolsDistrict[]
): Promise<ISchool[]> {
  const query = districts
    .map((item: string | ISchoolsDistrict) => {
      return typeof item === 'string'
        ? `districts[]=${item}`
        : `districts[]=${item.value}`
    })
    .join('&')

  if (!query) {
    return Promise.resolve([] as ISchool[])
  }

  try {
    const response = await new Fetch().get(`/schools/search?${query}`)

    return response.body.data.map(({ name, school_type }) => ({
      name,
      type: school_type
    }))
  } catch (error) {
    return Promise.resolve([] as ISchool[])
  }
}

export default getSchools
