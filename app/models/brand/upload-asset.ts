import Fetch from '../../services/fetch'

export async function uploadBrandAsset(
  brand: UUID,
  file: File,
  label?: string
): Promise<IBrandAsset> {
  const request = new Fetch()
    .upload(`/brands/${brand}/assets`)
    .attach('file', file)

  if (label) {
    request.field('label', label)
  }

  const response = await request

  return response.body.data
}
