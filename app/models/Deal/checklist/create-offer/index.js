import { createChecklist } from '../create-checklist'

/**
 * create a new offer
 */
export async function createOffer(deal, { name, order, is_deactivated }) {
  try {
    return createChecklist(deal.id, {
      checklist: {
        title: `Offer (${name})`,
        is_deactivated,
        order
      },
      conditions: {
        deal_type: 'Buying',
        property_type: deal.property_type
      }
    })
  } catch (e) {
    throw e
  }
}
