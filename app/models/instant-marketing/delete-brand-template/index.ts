import Fetch from '../../../services/fetch'

export function deleteBrandTemplate(brandId: UUID, brandTemplateId: UUID) {
  try {
    return new Fetch().delete(`/brands/${brandId}/templates/${brandTemplateId}`)
  } catch (e) {
    throw e
  }
}
