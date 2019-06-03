import Fetch from 'services/fetch'

const ASSET_UPLOAD_ENDPOINT = '/templates/assets'

export function uploadAsset(file, templateId) {
  return new Fetch()
    .upload(ASSET_UPLOAD_ENDPOINT)
    .attach('attachment', file, file.name)
    .field('template', templateId)
}
