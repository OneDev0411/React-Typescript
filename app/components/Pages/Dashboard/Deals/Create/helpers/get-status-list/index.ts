export function getStatusList(
  deal: Nullable<IDeal>,
  type: IBrandChecklist['checklist_type']
) {
  if (!deal) {
    return []
  }

  const checklist = deal?.property_type?.checklists?.find(
    ({ checklist_type }) => checklist_type === type
  )

  return checklist?.statuses || []
}
