import Fetch from 'services/fetch'

export async function getBrandForms(brandId: string): Promise<IDealForm[]> {
  const response = await new Fetch().get(`/brands/${brandId}/forms`)

  return response.body.data
}
