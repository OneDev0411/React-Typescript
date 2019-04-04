export function getActiveChecklist(deal, checklists) {
  let checklist = checklists[0]

  if (deal.deal_type === 'Selling') {
    checklist = checklists.find(
      checklist => checklist.checklist_type === 'Selling'
    )
  }

  return checklist
}
