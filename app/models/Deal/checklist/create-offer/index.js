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
        checklist_type: 'Offer',
        property_type: deal.property_type.id
      }
    })
  } catch (e) {
    throw e
  }
}
