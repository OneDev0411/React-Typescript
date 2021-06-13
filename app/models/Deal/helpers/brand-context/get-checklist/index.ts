export function getContextsChecklist(
  deal: IDeal,
  brandChecklists: IBrandChecklist[]
) {
  const checklistType: IDealChecklistType = deal.has_active_offer
    ? 'Offer'
    : deal.deal_type

  return brandChecklists.filter(
    brandChecklist =>
      brandChecklist.property_type === deal.property_type?.id &&
      brandChecklist.checklist_type === checklistType
  )
}
