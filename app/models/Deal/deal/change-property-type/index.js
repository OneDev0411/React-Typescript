import Fetch from '../../../../services/fetch'

export async function changePropertyType(dealId, propertyType) {
  try {
    const response = await new Fetch()
      .patch(`/deals/${dealId}/property_type`)
      .send({
        property_type: propertyType
      })

    return response.body.data
  } catch (e) {
    throw e
  }
}
