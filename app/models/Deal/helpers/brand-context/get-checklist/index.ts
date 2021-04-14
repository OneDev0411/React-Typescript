export function getContextsChecklist(deal: IDeal) {
  const checklistType: IDealChecklistType = deal.has_active_offer
    ? 'Offer'
    : deal.deal_type

  return deal.property_type.checklists?.find(
    checklist => checklist.checklist_type === checklistType
  )
}
