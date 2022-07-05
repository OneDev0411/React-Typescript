export function isImageAsset(asset: IBrandAsset): boolean {
  return (
    asset.file.url.endsWith('.jpg') ||
    asset.file.url.endsWith('.jpeg') ||
    asset.file.url.endsWith('.png') ||
    asset.file.url.endsWith('.gif')
  )
}
