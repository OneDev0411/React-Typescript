export function getActiveChecklist(
  deal: IDeal,
  checklists: IDealChecklist[]
): IDealChecklist | undefined {
  let checklist: IDealChecklist | undefined

  if (deal.deal_type === 'Selling') {
    checklist = checklists.find(
      checklist =>
        checklist.checklist_type === 'Buying' && checklist.is_active_offer
    )
  }

  return checklist || checklists[0]
}
