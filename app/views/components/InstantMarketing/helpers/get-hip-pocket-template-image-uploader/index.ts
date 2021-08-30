import { uploadAsset } from 'models/instant-marketing/upload-asset'

export function getHipPocketTemplateImagesUploader(marketingTemplateId: UUID) {
  return async (files: File[]): Promise<string[]> => {
    const uploadResult = await Promise.all(
      files.map(file => uploadAsset(marketingTemplateId, file))
    )

    return uploadResult.map(result => result.file.url)
  }
}
