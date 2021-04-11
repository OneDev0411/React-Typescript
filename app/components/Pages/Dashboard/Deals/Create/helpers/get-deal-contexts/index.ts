export function getDealContexts(
  deal: IDeal,
  dealType?: IDealType
): IDealBrandContext[] {
  if (!deal || !dealType) {
    return []
  }

  const checklist = deal.property_type.checklists?.find(
    checklist => checklist.checklist_type === dealType
  )

  return checklist?.required_contexts || []
}
