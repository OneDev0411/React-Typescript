import { uploadResizedAsset } from '@app/models/instant-marketing/upload-resized-asset'
import { uploadAsset } from 'models/instant-marketing/upload-asset'

import { shouldResizeTemplateAssets } from '../should-resize-template-assets'

export function getHipPocketTemplateImagesUploader(
  marketingTemplateId: UUID,
  marketingTemplateMedium?: IMarketingTemplateMedium
) {
  const shouldResize = shouldResizeTemplateAssets(marketingTemplateMedium)

  return async (files: File[]): Promise<string[]> => {
    const uploadResult = await Promise.all(
      files.map(file =>
        shouldResize
          ? uploadResizedAsset(marketingTemplateId, file)
          : uploadAsset(marketingTemplateId, file)
      )
    )

    return uploadResult.map(result => result.file.url)
  }
}
