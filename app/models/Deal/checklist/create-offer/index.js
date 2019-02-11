import { createChecklist } from '../create-checklist'

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
    const data = {
      checklist: {
        title: `Offer (${name})`,
        is_deactivated: is_backup,
        order
      },
      conditions: {
        deal_type: 'Buying',
        property_type
      }
    }

    return await createChecklist(deal_id, data)
  } catch (e) {
    throw e
  }
}
