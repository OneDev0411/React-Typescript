import Fetch from '../../services/fetch'

export function updatePalette(brandId: UUID, palette: BrandMarketingPalette) {
  return new Fetch().put(`/brands/${brandId}/settings/marketing_palette`).send({
    value: palette
  })
}
