import { uploadAsset } from 'models/instant-marketing/upload-asset'

import { shouldResizeTemplateAssets } from '../should-resize-template-assets'

export function getHipPocketTemplateImagesUploader(
  marketingTemplateId: UUID,
  marketingTemplateMedium?: IMarketingTemplateMedium
) {
  const shouldResize = shouldResizeTemplateAssets(marketingTemplateMedium)

  return async (files: File[]): Promise<string[]> => {
    const uploadResult = await Promise.all(
      files.map(file => uploadAsset(marketingTemplateId, file, shouldResize))
    )

    return uploadResult.map(result => result.file.url)
  }
}
