export function getContextsChecklist(
  deal: IDeal | IDeal<'listing_info'>,
  brandChecklists: IBrandChecklist[]
) {
  const checklistTypes = deal.has_active_offer
    ? [deal.deal_type, 'Offer']
    : [deal.deal_type]

  return brandChecklists.filter(
    brandChecklist =>
      brandChecklist.property_type === deal.property_type?.id &&
      checklistTypes.includes(brandChecklist.checklist_type)
  )
}
