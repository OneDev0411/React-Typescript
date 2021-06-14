export function getActiveChecklist(
  deal: IDeal,
  checklists: IDealChecklist[],
  checklistType?: IDealChecklistType
): IDealChecklist | undefined {
  const type =
    checklistType || (deal.has_active_offer ? 'Offer' : deal.deal_type)

  const brandChecklist = deal.property_type.checklists?.find(
    checklist => checklist.checklist_type === type
  )

  return checklists.find(item => {
    if (type === 'Offer') {
      return item.origin === brandChecklist?.id && item.is_active_offer
    }

    return item.origin === brandChecklist?.id
  })
}
