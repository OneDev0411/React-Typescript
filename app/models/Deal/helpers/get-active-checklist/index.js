export function getActiveChecklist(deal, checklists) {
  let checklist = null

  if (deal.deal_type === 'Selling') {
    checklist = checklists.find(
      checklist => checklist.checklist_type === 'Buying'
    )
  }

  return checklist || checklists[0]
}
