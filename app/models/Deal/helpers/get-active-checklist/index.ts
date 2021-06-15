export function getActiveChecklist(
  deal: IDeal,
  brandChecklists: IBrandChecklist[],
  checklists: IDealChecklist[],
  checklistType?: IDealChecklistType
): IDealChecklist | undefined {
  const type =
    checklistType || (deal.has_active_offer ? 'Offer' : deal.deal_type)

  const dealBrandChecklists = brandChecklists?.filter(
    checklist =>
      checklist.checklist_type === type &&
      checklist.property_type === deal.property_type?.id
  )

  return checklists.find(({ origin, is_active_offer }) => {
    if (type === 'Offer') {
      return dealBrandChecklists.find(
        brandChecklist => origin === brandChecklist.id && is_active_offer
      )
    }

    return dealBrandChecklists.find(
      brandChecklist => origin === brandChecklist.id
    )
  })
}
