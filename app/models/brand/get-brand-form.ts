import Fetch from '@app/services/fetch'

export async function getBrandForm(
  brandId: UUID,
  formId: UUID
): Promise<IFile> {
  try {
    const response = await new Fetch().get(`/brands/${brandId}/forms/${formId}`)

    return response.body.data
  } catch (error) {
    console.log(error)

    throw error
  }
}
