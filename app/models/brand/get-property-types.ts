import Fetch from '../../services/fetch'

export async function getBrandPropertyTypes(brandId: UUID) {
  try {
    const response = await new Fetch()
      .get(`/brands/${brandId}/deals/property_types`)
      .query({
        associations: [
          'brand_property_type.checklists',
          'brand_checklist.required_contexts',
          'brand_checklist.optional_contexts'
        ]
      })

    return response.body.data
  } catch (e) {
    throw e
  }
}
