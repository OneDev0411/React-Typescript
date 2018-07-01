import Fetch from '../../services/fetch'

/**
 * create a new offer
 */
export async function createOffer(
  deal_id,
  name,
  order,
  is_backup,
  property_type
) {
  try {
    const response = await new Fetch()
      .post(`/deals/${deal_id}/checklists/offer`)
      .send({
        checklist: {
          title: `Offer (${name})`,
          is_deactivated: is_backup,
          order
        },
        conditions: {
          deal_type: 'Buying',
          property_type
        }
      })

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default {
  createOffer
}
