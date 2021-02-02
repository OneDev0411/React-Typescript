import Fetch from '../../services/fetch'

export async function getBrandAssets(brand: UUID): Promise<IBrandAsset[]> {
  const response = await new Fetch().get(`/brands/${brand}/assets`)

  const allAssets: IBrandAsset[] = response.body.data

  return allAssets.filter(asset => !!asset.label)
}
