export function getActiveChecklist(deal, checklists) {
  let checklist = null

  if (deal.deal_type === 'Selling') {
    checklist = checklists.find(
      checklist =>
        checklist.checklist_type === 'Buying' && checklist.is_active_offer
    )
  }

  return checklist || checklists[0]
}
