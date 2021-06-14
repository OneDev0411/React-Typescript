export function getDealContexts(
  deal: IDeal,
  checklistType?: IBrandChecklist['checklist_type']
): IDealBrandContext[] {
  if (!deal || !checklistType) {
    return []
  }

  const checklist = deal.property_type.checklists?.find(
    checklist => checklist.checklist_type === checklistType
  )

  return (checklist?.required_contexts || []).filter(context => {
    if (context.key === 'listing_status' || context.key === 'contract_status') {
      return false
    }

    return true
  })
}
