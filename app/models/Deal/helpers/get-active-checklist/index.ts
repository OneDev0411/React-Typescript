export function getActiveChecklist(
  deal: IDeal,
  brandChecklists: IBrandChecklist[],
  checklists: IDealChecklist[],
  checklistType?: IDealChecklistType
): IDealChecklist | undefined {
  const type =
    checklistType || (deal.has_active_offer ? 'Offer' : deal.deal_type)

  const brandChecklist = brandChecklists?.find(
    checklist =>
      checklist.checklist_type === type &&
      checklist.property_type === deal.property_type?.id
  )

  return checklists.find(item => {
    if (type === 'Offer') {
      return item.origin === brandChecklist?.id && item.is_active_offer
    }

    return item.origin === brandChecklist?.id
  })
}
