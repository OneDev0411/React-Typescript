import Fetch from '../../services/fetch'

export async function uploadBrandAsset(
  brand: UUID,
  file: File
): Promise<IFile> {
  const response = await new Fetch()
    .upload(`/brands/${brand}/assets`)
    .attach('file', file, file.name)

  return response.body.data.file
}
