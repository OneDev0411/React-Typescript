import { Response } from 'superagent'

import Fetch from 'services/fetch'

const ASSET_UPLOAD_ENDPOINT = '/templates/assets'

export function uploadAsset(file: File, templateId?: string): Promise<Response> {
  const request = new Fetch()
    .upload(ASSET_UPLOAD_ENDPOINT)
    .attach('attachment', file, file.name)
  if (templateId) {
    request.field('template', templateId)
  }
  return request
}
