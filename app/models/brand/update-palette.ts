import Fetch from '../../services/fetch'

export function updatePalette(brandId: UUID, palette: BrandMarketingPalette) {
  return new Fetch()
    .put(`/brands/${brandId}/settings/palette`)
    .send({ palette })
}
