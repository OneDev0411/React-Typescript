import Fetch from '@app/services/fetch'

export async function getBrandForms(brandId: UUID): Promise<IBrandForm[]> {
  try {
    const response = await new Fetch().get(`/brands/${brandId}/forms`)

    return response.body.data
  } catch (e) {
    console.log(e)

    return []
  }
}
